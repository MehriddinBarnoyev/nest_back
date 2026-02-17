import { IsNumber, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
    @ApiProperty({ example: 120000, required: false })
    @IsNumber()
    @Min(0)
    @IsOptional()
    amount?: number;

    @ApiProperty({ example: 'UZS', default: 'UZS', required: false })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({ example: 30, required: false })
    @IsInt()
    @IsOptional()
    accessDurationDays?: number;

    @ApiProperty({ example: 'Thank you for your request', required: false })
    @IsString()
    @IsOptional()
    note?: string;
}
