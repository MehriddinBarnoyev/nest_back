import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    Query,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InvoiceStatus, UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Invoices')
@ApiBearerAuth()
@Controller('api')
export class InvoicesController {
    constructor(private invoicesService: InvoicesService) { }

    @Post('owner/access-requests/:requestId/invoice')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Create invoice for an access request' })
    createFromRequest(
        @Param('requestId', ParseUUIDPipe) requestId: string,
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Body() dto: CreateInvoiceDto,
    ) {
        return this.invoicesService.createFromRequest(requestId, ownerUserId, userRole, dto);
    }

    @Patch('owner/invoices/:id/send')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Send invoice to student' })
    send(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
    ) {
        return this.invoicesService.send(id, ownerUserId, userRole);
    }

    @Get('me/invoices')
    @ApiOperation({ summary: 'List my invoices' })
    @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findMyInvoices(
        @CurrentUser('id') userId: string,
        @Query('status') status?: InvoiceStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.invoicesService.findMyInvoices(userId, status, page, limit);
    }

    @Get('owner/invoices')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'List invoices for my courses' })
    @ApiQuery({ name: 'status', enum: InvoiceStatus, required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findForOwner(
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Query('status') status?: InvoiceStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.invoicesService.findForOwner(ownerUserId, userRole, status, page, limit);
    }
}
