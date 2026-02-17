import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitPaymentDto } from './dto/init-payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { PaymentStatus, PaymentProvider, UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('api')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @ApiBearerAuth()
    @Post('payments/init')
    @ApiOperation({ summary: 'Initiate payment for an invoice' })
    initPayment(
        @CurrentUser('id') userId: string,
        @Body() dto: InitPaymentDto,
    ) {
        return this.paymentsService.initPayment(userId, dto);
    }

    @Public()
    @Post('payme/callback')
    @ApiOperation({ summary: 'Payme webhook callback' })
    paymeCallback(@Body() payload: any) {
        return this.paymentsService.handleCallback(PaymentProvider.PAYME, payload);
    }

    @Public()
    @Post('click/prepare')
    @ApiOperation({ summary: 'Click prepare callback' })
    clickPrepare(@Body() payload: any) {
        // Click has prepare and complete
        return { error: 0, error_note: 'Success' };
    }

    @Public()
    @Post('click/complete')
    @ApiOperation({ summary: 'Click complete callback' })
    clickComplete(@Body() payload: any) {
        return this.paymentsService.handleCallback(PaymentProvider.CLICK, payload);
    }

    @ApiBearerAuth()
    @Post('payments/:id/confirm')
    @ApiOperation({ summary: 'Confirm a pending payment (Mock flow)' })
    confirmPayment(
        @Param('id', ParseUUIDPipe) paymentId: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: UserRole,
    ) {
        return this.paymentsService.confirmPayment(paymentId, userId, userRole);
    }

    @ApiBearerAuth()
    @Get('owner/payments')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'List payments for my courses' })
    @ApiQuery({ name: 'courseId', required: false })
    @ApiQuery({ name: 'status', enum: PaymentStatus, required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findForOwner(
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Query('courseId') courseId?: string,
        @Query('status') status?: PaymentStatus,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.paymentsService.findForOwner(
            ownerUserId,
            userRole,
            courseId,
            status,
            dateFrom ? new Date(dateFrom) : undefined,
            dateTo ? new Date(dateTo) : undefined,
            page ? +page : 1,
            limit ? +limit : 10,
        );
    }

    @ApiBearerAuth()
    @Get('owner/progress')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get student progress report for a course' })
    @ApiQuery({ name: 'courseId', required: true })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    getProgressReport(
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Query('courseId', ParseUUIDPipe) courseId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.paymentsService.getProgressReport(
            ownerUserId,
            userRole,
            courseId,
            page ? +page : 1,
            limit ? +limit : 10,
        );
    }
}
