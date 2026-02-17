import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus, AccessRequestStatus, UserRole } from '@prisma/client';

@Injectable()
export class InvoicesService {
    private readonly logger = new Logger(InvoicesService.name);
    constructor(private prisma: PrismaService) { }

    async createFromRequest(requestId: string, ownerUserId: string, userRole: UserRole, dto: CreateInvoiceDto) {
        const request = await this.prisma.accessRequest.findUnique({
            where: { id: requestId },
            include: { course: true },
        });

        if (!request) {
            throw new NotFoundException('Access request not found');
        }

        if (userRole !== UserRole.ADMIN && request.ownerId !== ownerUserId) {
            throw new ForbiddenException('You do not own this request');
        }

        if (request.status !== AccessRequestStatus.PENDING) {
            throw new BadRequestException('Can only create invoice for PENDING requests');
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
                    status: InvoiceStatus.DRAFT,
                    issuedAt: null,
                },
            });

            await tx.accessRequest.update({
                where: { id: requestId },
                data: { status: AccessRequestStatus.INVOICED },
            });

            return invoice;
        });
    }

    async send(id: string, ownerUserId: string, userRole: UserRole) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice) throw new NotFoundException('Invoice not found');

        if (userRole !== UserRole.ADMIN && invoice.ownerId !== ownerUserId) {
            throw new ForbiddenException('You do not own this invoice');
        }

        if (invoice.status !== InvoiceStatus.DRAFT) {
            throw new BadRequestException('Only DRAFT invoices can be sent');
        }

        return await this.prisma.invoice.update({
            where: { id },
            data: { status: InvoiceStatus.SENT, issuedAt: new Date() },
        });
    }

    async findMyInvoices(userId: string, status?: InvoiceStatus, page = 1, limit = 10) {
        this.logger.debug(`findMyInvoices: userId=${userId}, status=${status}`);
        const skip = (page - 1) * limit;
        const where: any = { userId };
        if (status) {
            where.status = status;
        } else {
            where.status = { in: [InvoiceStatus.SENT, InvoiceStatus.PAID] };
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

    async findForOwner(ownerUserId: string, userRole: UserRole, status?: InvoiceStatus, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where: any = {};
        if (userRole !== UserRole.ADMIN) {
            where.ownerId = ownerUserId;
        }
        if (status) where.status = status;

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
}
