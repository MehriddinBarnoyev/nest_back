import { PaymentsService } from './payments.service';
import { InitPaymentDto } from './dto/init-payment.dto';
import { PaymentStatus, UserRole } from '@prisma/client';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    initPayment(userId: string, dto: InitPaymentDto): Promise<{
        paymentId: string;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        amount: number;
        currency: string;
        message: string;
    }>;
    paymeCallback(payload: any): Promise<{
        success: boolean;
    }>;
    clickPrepare(payload: any): {
        error: number;
        error_note: string;
    };
    clickComplete(payload: any): Promise<{
        success: boolean;
    }>;
    confirmPayment(paymentId: string, userId: string, userRole: UserRole): Promise<{
        success: boolean;
    }>;
    findForOwner(ownerUserId: string, userRole: UserRole, courseId?: string, status?: PaymentStatus, dateFrom?: string, dateTo?: string, page?: number, limit?: number): Promise<{
        results: ({
            user: {
                email: string;
                fullName: string | null;
            };
            invoice: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            ownerId: string;
            amount: number;
            currency: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            provider: import("@prisma/client").$Enums.PaymentProvider;
            invoiceId: string;
            providerRef: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            totalAmount: number;
        };
    }>;
    getProgressReport(ownerUserId: string, userRole: UserRole, courseId: string, page?: number, limit?: number): Promise<{
        results: {
            user: {
                id: string;
                email: string;
                fullName: string | null;
            };
            percentComplete: number;
            completedLessons: number;
            totalLessons: number;
            lastLessonId: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
