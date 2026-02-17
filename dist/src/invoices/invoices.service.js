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
var InvoicesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InvoicesService = InvoicesService_1 = class InvoicesService {
    prisma;
    logger = new common_1.Logger(InvoicesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createFromRequest(requestId, ownerUserId, userRole, dto) {
        const request = await this.prisma.accessRequest.findUnique({
            where: { id: requestId },
            include: { course: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Access request not found');
        }
        if (userRole !== client_1.UserRole.ADMIN && request.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You do not own this request');
        }
        if (request.status !== client_1.AccessRequestStatus.PENDING) {
            throw new common_1.BadRequestException('Can only create invoice for PENDING requests');
        }
        return await this.prisma.$transaction(async (tx) => {
            const invoice = await tx.invoice.create({
                data: {
                    accessRequestId: requestId,
                    courseId: request.courseId,
                    userId: request.userId,
                    ownerId: request.ownerId,
                    amount: dto.amount ?? request.course.priceAmount,
                    currency: dto.currency ?? request.course.currency ?? 'UZS',
                    accessDurationDays: dto.accessDurationDays,
                    note: dto.note,
                    status: client_1.InvoiceStatus.DRAFT,
                    issuedAt: null,
                },
            });
            await tx.accessRequest.update({
                where: { id: requestId },
                data: { status: client_1.AccessRequestStatus.INVOICED },
            });
            return invoice;
        });
    }
    async send(id, ownerUserId, userRole) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        if (userRole !== client_1.UserRole.ADMIN && invoice.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You do not own this invoice');
        }
        if (invoice.status !== client_1.InvoiceStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT invoices can be sent');
        }
        return await this.prisma.invoice.update({
            where: { id },
            data: { status: client_1.InvoiceStatus.SENT, issuedAt: new Date() },
        });
    }
    async findMyInvoices(userId, status, page = 1, limit = 10) {
        this.logger.debug(`findMyInvoices: userId=${userId}, status=${status}`);
        const skip = (page - 1) * limit;
        const where = { userId };
        if (status) {
            where.status = status;
        }
        else {
            where.status = { in: [client_1.InvoiceStatus.SENT, client_1.InvoiceStatus.PAID] };
        }
        this.logger.debug(`findMyInvoices: where=${JSON.stringify(where)}`);
        const [results, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    course: { select: { title: true } },
                },
            }),
            this.prisma.invoice.count({ where }),
        ]);
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
    async findForOwner(ownerUserId, userRole, status, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole !== client_1.UserRole.ADMIN) {
            where.ownerId = ownerUserId;
        }
        if (status)
            where.status = status;
        const [results, total] = await Promise.all([
            this.prisma.invoice.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    course: { select: { title: true } },
                    user: { select: { fullName: true, email: true } },
                },
            }),
            this.prisma.invoice.count({ where }),
        ]);
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
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = InvoicesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map