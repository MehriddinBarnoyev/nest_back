import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus, UserRole } from '@prisma/client';
export declare class InvoicesController {
    private invoicesService;
    constructor(invoicesService: InvoicesService);
    createFromRequest(requestId: string, ownerUserId: string, userRole: UserRole, dto: CreateInvoiceDto): Promise<{
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
    send(id: string, ownerUserId: string, userRole: UserRole): Promise<{
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
    findMyInvoices(userId: string, status?: InvoiceStatus, page?: number, limit?: number): Promise<{
        results: ({
            course: {
                title: string;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findForOwner(ownerUserId: string, userRole: UserRole, status?: InvoiceStatus, page?: number, limit?: number): Promise<{
        results: ({
            user: {
                email: string;
                fullName: string | null;
            };
            course: {
                title: string;
            };
        } & {
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
