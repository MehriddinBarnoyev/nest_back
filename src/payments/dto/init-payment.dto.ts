import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider } from '@prisma/client';

export class InitPaymentDto {
    @ApiProperty({ example: 'uuid-of-invoice' })
    @IsUUID()
    invoiceId: string;

    @ApiProperty({ enum: PaymentProvider, default: PaymentProvider.PAYME })
    @IsEnum(PaymentProvider)
    provider: PaymentProvider;
}
