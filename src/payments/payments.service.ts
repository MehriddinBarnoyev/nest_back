import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitPaymentDto } from './dto/init-payment.dto';
import {
    InvoiceStatus,
    PaymentStatus,
    PaymentProvider,
    AccessRequestStatus,
    UserRole,
} from '@prisma/client';

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    constructor(private prisma: PrismaService) { }

    async initPayment(userId: string, dto: InitPaymentDto) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id: dto.invoiceId },
        });

        if (!invoice) throw new NotFoundException('Invoice not found');
        if (invoice.userId !== userId) throw new ForbiddenException('You do not own this invoice');
        if (invoice.status !== InvoiceStatus.SENT) {
            throw new BadRequestException('Can only pay for SENT invoices');
        }

        const payment = await this.prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                userId: invoice.userId,
                ownerId: invoice.ownerId,
                amount: invoice.amount,
                currency: invoice.currency,
                provider: dto.provider,
                status: PaymentStatus.PENDING,
            },
        });

        // Strategy pattern or simple switch for provider payload
        return {
            paymentId: payment.id,
            provider: dto.provider,
            amount: payment.amount,
            currency: payment.currency,
            message: 'Payment initiated successfully. Please use the following details to complete the payment.',
            // In a real app, return Payme/Click checkout URL or payload
        };
    }

    async handleCallback(provider: PaymentProvider, payload: any) {
        // Verification stub
        console.log(`Received ${provider} callback:`, payload);

        // In a real app, verify signature/secret here
        // Verify payload.amount, payload.invoiceId, etc.

        const paymentId = payload.paymentId; // Mocking payload structure
        const providerRef = payload.providerRef;

        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) throw new NotFoundException('Payment not found');
        this.logger.debug(`handleCallback: payment found, status=${payment.status}`);
        if (payment.status !== PaymentStatus.PENDING) return { success: true }; // Idempotency

        this.logger.debug(`handleCallback: processing payment ${paymentId} for invoice ${payment.invoiceId}`);

        return await this.prisma.$transaction(async (tx) => {
            // 1. Update Payment
            const updatedPayment = await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.SUCCEEDED,
                    providerRef: providerRef,
                },
            });

            // 2. Update Invoice
            const invoice = await tx.invoice.update({
                where: { id: payment.invoiceId },
                data: { status: InvoiceStatus.PAID },
            });

            // 3. Update AccessRequest if exists
            if (invoice.accessRequestId) {
                await tx.accessRequest.update({
                    where: { id: invoice.accessRequestId },
                    data: { status: AccessRequestStatus.APPROVED },
                });
            }

            // 4. Create/Upsert Entitlement
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

    async confirmPayment(paymentId: string, userId: string, userRole: UserRole) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
        });

        if (!payment) throw new NotFoundException('Payment not found');
        if (userRole !== UserRole.ADMIN && payment.userId !== userId) {
            throw new ForbiddenException('You do not own this payment');
        }

        if (payment.status !== PaymentStatus.PENDING) {
            throw new BadRequestException('Payment is already processed');
        }

        return await this.handleCallback(payment.provider, {
            paymentId: payment.id,
            providerRef: 'MOCK_CONFIRM_' + Date.now(),
        });
    }

    async findForOwner(
        ownerUserId: string,
        userRole: UserRole,
        courseId?: string,
        status?: PaymentStatus,
        dateFrom?: Date,
        dateTo?: Date,
        page = 1,
        limit = 10,
    ) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (userRole !== UserRole.ADMIN) {
            where.ownerId = ownerUserId;
        }
        if (courseId) where.invoice = { courseId };
        if (status) where.status = status;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = dateFrom;
            if (dateTo) where.createdAt.lte = dateTo;
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
                where: { ...where, status: PaymentStatus.SUCCEEDED },
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

    async getProgressReport(ownerUserId: string, userRole: UserRole, courseId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        // Check ownership
        if (userRole !== UserRole.ADMIN) {
            const course = await this.prisma.course.findUnique({ where: { id: courseId } });
            if (!course) throw new NotFoundException('Course not found');
            if (course.creatorId !== ownerUserId) {
                // Need to check if ownerUserId is user id, but course creatorId is creator profile id
                const creator = await this.prisma.creatorProfile.findUnique({ where: { userId: ownerUserId } });
                if (!creator || course.creatorId !== creator.id) {
                    throw new ForbiddenException('You do not own this course');
                }
            }
        }

        // Get all students entitled to this course
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

        const results = await Promise.all(
            entitlements.map(async (e) => {
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
            }),
        );

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
}
