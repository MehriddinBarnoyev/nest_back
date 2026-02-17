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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const invoices_service_1 = require("../invoices/invoices.service");
let AccessRequestsService = class AccessRequestsService {
    prisma;
    invoicesService;
    constructor(prisma, invoicesService) {
        this.prisma = prisma;
        this.invoicesService = invoicesService;
    }
    async create(userId, dto) {
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId },
            include: { creator: true },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course not found');
        }
        if (course.visibility !== client_1.CourseVisibility.PRIVATE) {
            throw new common_1.BadRequestException('Access requests are only for PRIVATE courses');
        }
        const existingRequest = await this.prisma.accessRequest.findFirst({
            where: {
                userId,
                courseId: dto.courseId,
                status: {
                    in: [client_1.AccessRequestStatus.PENDING, client_1.AccessRequestStatus.INVOICED],
                },
            },
        });
        if (existingRequest) {
            throw new common_1.BadRequestException('You already have an active access request for this course');
        }
        return await this.prisma.accessRequest.create({
            data: {
                userId,
                courseId: dto.courseId,
                ownerId: course.creator.userId,
                status: client_1.AccessRequestStatus.PENDING,
            },
        });
    }
    async findMyRequests(userId, status, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = { userId };
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
    async findForOwner(ownerUserId, userRole, status, courseId, q, dateFrom, dateTo, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (userRole !== client_1.UserRole.ADMIN) {
            where.ownerId = ownerUserId;
        }
        if (status)
            where.status = status;
        if (courseId)
            where.courseId = courseId;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = dateFrom;
            if (dateTo)
                where.createdAt.lte = dateTo;
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
    async accept(id, ownerUserId, userRole, dto) {
        return await this.invoicesService.createFromRequest(id, ownerUserId, userRole, dto);
    }
    async reject(id, ownerUserId, userRole) {
        const request = await this.prisma.accessRequest.findUnique({
            where: { id },
            include: { invoice: true },
        });
        if (!request)
            throw new common_1.NotFoundException('Access request not found');
        if (userRole !== client_1.UserRole.ADMIN && request.ownerId !== ownerUserId) {
            throw new common_1.ForbiddenException('You do not own this request');
        }
        return await this.prisma.$transaction(async (tx) => {
            if (request.invoice && (request.invoice.status === 'DRAFT' || request.invoice.status === 'SENT')) {
                await tx.invoice.update({
                    where: { id: request.invoice.id },
                    data: { status: 'VOID' },
                });
            }
            return await tx.accessRequest.update({
                where: { id },
                data: { status: client_1.AccessRequestStatus.REJECTED },
            });
        });
    }
};
exports.AccessRequestsService = AccessRequestsService;
exports.AccessRequestsService = AccessRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        invoices_service_1.InvoicesService])
], AccessRequestsService);
//# sourceMappingURL=access-requests.service.js.map