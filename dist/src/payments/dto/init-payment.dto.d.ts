import { PaymentProvider } from '@prisma/client';
export declare class InitPaymentDto {
    invoiceId: string;
    provider: PaymentProvider;
}
