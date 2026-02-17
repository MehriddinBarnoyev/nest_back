import { PrismaService } from '../prisma/prisma.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { AccessRequestStatus, UserRole } from '@prisma/client';
import { InvoicesService } from '../invoices/invoices.service';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
export declare class AccessRequestsService {
    private prisma;
    private invoicesService;
    constructor(prisma: PrismaService, invoicesService: InvoicesService);
    create(userId: string, dto: CreateAccessRequestDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        ownerId: string;
        status: import("@prisma/client").$Enums.AccessRequestStatus;
    }>;
    findMyRequests(userId: string, status?: AccessRequestStatus, page?: number, limit?: number): Promise<{
        results: ({
            course: {
                title: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            userId: string;
            ownerId: string;
            status: import("@prisma/client").$Enums.AccessRequestStatus;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findForOwner(ownerUserId: string, userRole: UserRole, status?: AccessRequestStatus, courseId?: string, q?: string, dateFrom?: Date, dateTo?: Date, page?: number, limit?: number): Promise<{
        results: ({
            user: {
                email: string;
                fullName: string | null;
            };
            invoice: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                accessRequestId: string | null;
                courseId: string;
                userId: string;
                ownerId: string;
                amount: number;
                currency: string;
                accessDurationDays: number | null;
                note: string | null;
                status: import("@prisma/client").$Enums.InvoiceStatus;
                issuedAt: Date | null;
                expiresAt: Date | null;
            } | null;
            course: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            userId: string;
            ownerId: string;
            status: import("@prisma/client").$Enums.AccessRequestStatus;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    accept(id: string, ownerUserId: string, userRole: UserRole, dto: CreateInvoiceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        accessRequestId: string | null;
        courseId: string;
        userId: string;
        ownerId: string;
        amount: number;
        currency: string;
        accessDurationDays: number | null;
        note: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        issuedAt: Date | null;
        expiresAt: Date | null;
    }>;
    reject(id: string, ownerUserId: string, userRole: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        courseId: string;
        userId: string;
        ownerId: string;
        status: import("@prisma/client").$Enums.AccessRequestStatus;
    }>;
}
