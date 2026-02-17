"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    prisma;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initPayment(userId, dto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: dto.invoiceId },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        if (invoice.userId !== userId)
            throw new common_1.ForbiddenException('You do not own this invoice');
        if (invoice.status !== client_1.InvoiceStatus.SENT) {
            throw new common_1.BadRequestException('Can only pay for SENT invoices');
        }
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                userId: invoice.userId,
                ownerId: invoice.ownerId,
                amount: invoice.amount,
                currency: invoice.currency,
                provider: dto.provider,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        return {
            paymentId: payment.id,
            provider: dto.provider,
            amount: payment.amount,
            currency: payment.currency,
            message: 'Payment initiated successfully. Please use the following details to complete the payment.',
        };
    }
    async handleCallback(provider, payload) {
        console.log(`Received ${provider} callback:`, payload);
        const paymentId = payload.paymentId;
        const providerRef = payload.providerRef;
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        this.logger.debug(`handleCallback: payment found, status=${payment.status}`);
        if (payment.status !== client_1.PaymentStatus.PENDING)
            return { success: true };
        this.logger.debug(`handleCallback: processing payment ${paymentId} for invoice ${payment.invoiceId}`);
        return await this.prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: client_1.PaymentStatus.SUCCEEDED,
                    providerRef: providerRef,
                },
            });
            const invoice = await tx.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: client_1.InvoiceStatus.PAID },
            });
            if (invoice.accessRequestId) {
                await tx.accessRequest.update({
                    where: { id: invoice.accessRequestId },
                    data: { status: client_1.AccessRequestStatus.APPROVED },
                });
            }
            const activeUntil = invoice.accessDurationDays
                ? new Date(Date.now() + invoice.accessDurationDays * 24 * 60 * 60 * 1000)
                : null;
            await tx.entitlement.upsert({
                where: {
                    userId_courseId: {
                        userId: invoice.userId,
                        courseId: invoice.courseId,
                    },
                },
                create: {
                    userId: invoice.userId,
                    courseId: invoice.courseId,
                    source: 'PAYMENT',
                    sourceId: updatedPayment.id,
                    activeUntil,
                },
                update: {
                    source: 'PAYMENT',
                    sourceId: updatedPayment.id,
                    activeUntil,
                },
            });
            this.logger.debug(`handleCallback: entitlement created/updated for user ${invoice.userId} on course ${invoice.courseId}`);
            return { success: true };
        });
    }
    async confirmPayment(paymentId, userId, userRole) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        if (userRole !== client_1.UserRole.ADMIN && payment.userId !== userId) {
            throw new common_1.ForbiddenException('You do not own this payment');
        }
        if (payment.status !== client_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Payment is already processed');
        }
        return await this.handleCallback(payment.provider, {
            paymentId: payment.id,
            providerRef: 'MOCK_CONFIRM_' + Date.now(),
        });
    }
    async findForOwner(ownerUserId, userRole, courseId, status, dateFrom, dateTo, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole !== client_1.UserRole.ADMIN) {
            where.ownerId = ownerUserId;
        }
        if (courseId)
            where.invoice = { courseId };
        if (status)
            where.status = status;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = dateFrom;
            if (dateTo)
                where.createdAt.lte = dateTo;
        }
        const [results, total, sumResults] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { fullName: true, email: true } },
                    invoice: { include: { course: { select: { title: true } } } },
                },
            }),
            this.prisma.payment.count({ where }),
            this.prisma.payment.aggregate({
                where: { ...where, status: client_1.PaymentStatus.SUCCEEDED },
                _sum: { amount: true },
            }),
        ]);
        return {
            results,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalAmount: sumResults._sum.amount || 0,
            },
        };
    }
    async getProgressReport(ownerUserId, userRole, courseId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        if (userRole !== client_1.UserRole.ADMIN) {
            const course = await this.prisma.course.findUnique({ where: { id: courseId } });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
            if (course.creatorId !== ownerUserId) {
                const creator = await this.prisma.creatorProfile.findUnique({ where: { userId: ownerUserId } });
                if (!creator || course.creatorId !== creator.id) {
                    throw new common_1.ForbiddenException('You do not own this course');
                }
            }
        }
        const entitlements = await this.prisma.entitlement.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                course: {
                    include: {
                        _count: { select: { lessons: true } },
                    },
                },
            },
            skip,
            take: limit,
        });
        const results = await Promise.all(entitlements.map(async (e) => {
            const completedCount = await this.prisma.lessonProgress.count({
                where: {
                    userId: e.userId,
                    lesson: { courseId: e.courseId },
                    completedAt: { not: null },
                },
            });
            const totalLessons = e.course._count.lessons;
            const percentComplete = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const lastProgress = await this.prisma.lessonProgress.findFirst({
                where: {
                    userId: e.userId,
                    lesson: { courseId: e.courseId }
                },
                orderBy: { updatedAt: 'desc' },
                select: { lessonId: true }
            });
            return {
                user: e.user,
                percentComplete,
                completedLessons: completedCount,
                totalLessons,
                lastLessonId: lastProgress?.lessonId || null,
            };
        }));
        const total = await this.prisma.entitlement.count({ where: { courseId } });
        return {
            results,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map