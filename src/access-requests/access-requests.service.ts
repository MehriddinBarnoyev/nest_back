import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { AccessRequestStatus, CourseVisibility, UserRole } from '@prisma/client';
import { InvoicesService } from '../invoices/invoices.service';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';

@Injectable()
export class AccessRequestsService {
    constructor(
        private prisma: PrismaService,
        private invoicesService: InvoicesService,
    ) { }

    async create(userId: string, dto: CreateAccessRequestDto) {
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId },
            include: { creator: true },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        if (course.visibility !== CourseVisibility.PRIVATE) {
            throw new BadRequestException('Access requests are only for PRIVATE courses');
        }

        // Check if there is already an active request
        const existingRequest = await this.prisma.accessRequest.findFirst({
            where: {
                userId,
                courseId: dto.courseId,
                status: {
                    in: [AccessRequestStatus.PENDING, AccessRequestStatus.INVOICED],
                },
            },
        });

        if (existingRequest) {
            throw new BadRequestException('You already have an active access request for this course');
        }

        return await this.prisma.accessRequest.create({
            data: {
                userId,
                courseId: dto.courseId,
                ownerId: course.creator.userId,
                status: AccessRequestStatus.PENDING,
            },
        });
    }

    async findMyRequests(userId: string, status?: AccessRequestStatus, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where: any = { userId };
        if (status) {
            where.status = status;
        }

        const [results, total] = await Promise.all([
            this.prisma.accessRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    course: {
                        select: { title: true, slug: true },
                    },
                },
            }),
            this.prisma.accessRequest.count({ where }),
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

    async findForOwner(
        ownerUserId: string,
        userRole: UserRole,
        status?: AccessRequestStatus,
        courseId?: string,
        q?: string,
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

        if (status) where.status = status;
        if (courseId) where.courseId = courseId;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = dateFrom;
            if (dateTo) where.createdAt.lte = dateTo;
        }

        if (q) {
            where.user = {
                OR: [
                    { fullName: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            };
        }

        const [results, total] = await Promise.all([
            this.prisma.accessRequest.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    course: { select: { title: true } },
                    user: { select: { fullName: true, email: true } },
                    invoice: true,
                },
            }),
            this.prisma.accessRequest.count({ where }),
        ]);

        return {
            results,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async accept(id: string, ownerUserId: string, userRole: UserRole, dto: CreateInvoiceDto) {
        // Request must be PENDING
        // Create Invoice linked to request with status=SENT
        // Update AccessRequest status -> INVOICED
        // Return invoice
        return await this.invoicesService.createFromRequest(id, ownerUserId, userRole, dto);
    }

    async reject(id: string, ownerUserId: string, userRole: UserRole) {
        const request = await this.prisma.accessRequest.findUnique({
            where: { id },
            include: { invoice: true },
        });

        if (!request) throw new NotFoundException('Access request not found');

        if (userRole !== UserRole.ADMIN && request.ownerId !== ownerUserId) {
            throw new ForbiddenException('You do not own this request');
        }

        return await this.prisma.$transaction(async (tx) => {
            // Void invoice if exists
            if (request.invoice && (request.invoice.status === 'DRAFT' || request.invoice.status === 'SENT')) {
                await tx.invoice.update({
                    where: { id: request.invoice.id },
                    data: { status: 'VOID' },
                });
            }

            return await tx.accessRequest.update({
                where: { id },
                data: { status: AccessRequestStatus.REJECTED },
            });
        });
    }
}

