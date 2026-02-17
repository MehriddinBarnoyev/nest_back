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
import { AccessRequestsService } from './access-requests.service';
import { CreateAccessRequestDto } from './dto/create-access-request.dto';
import { CreateInvoiceDto } from '../invoices/dto/create-invoice.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessRequestStatus, UserRole } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('AccessRequests')
@ApiBearerAuth()
@Controller('api')
export class AccessRequestsController {
    constructor(private accessRequestsService: AccessRequestsService) { }

    @Post('access-requests')
    @ApiOperation({ summary: 'Create a new access request for a private course' })
    create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateAccessRequestDto,
    ) {
        return this.accessRequestsService.create(userId, dto);
    }

    @Get('me/access-requests')
    @ApiOperation({ summary: 'List my access requests' })
    @ApiQuery({ name: 'status', enum: AccessRequestStatus, required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findMyRequests(
        @CurrentUser('id') userId: string,
        @Query('status') status?: AccessRequestStatus,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.accessRequestsService.findMyRequests(userId, status, page, limit);
    }

    @Get('owner/access-requests')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'List access requests for my courses' })
    @ApiQuery({ name: 'status', enum: AccessRequestStatus, required: false })
    @ApiQuery({ name: 'courseId', required: false })
    @ApiQuery({ name: 'q', required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findForOwner(
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Query('status') status?: AccessRequestStatus,
        @Query('courseId') courseId?: string,
        @Query('q') q?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.accessRequestsService.findForOwner(
            ownerUserId,
            userRole,
            status,
            courseId,
            q,
            dateFrom ? new Date(dateFrom) : undefined,
            dateTo ? new Date(dateTo) : undefined,
            page ? +page : 1,
            limit ? +limit : 10,
        );
    }

    @Patch('owner/access-requests/:id/accept')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Accept an access request and create draft invoice for admin review' })
    accept(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
        @Body() dto?: CreateInvoiceDto,
    ) {
        return this.accessRequestsService.accept(id, ownerUserId, userRole, dto || {});
    }

    @Patch('owner/access-requests/:id/reject')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Reject an access request' })
    reject(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') ownerUserId: string,
        @CurrentUser('role') userRole: UserRole,
    ) {
        return this.accessRequestsService.reject(id, ownerUserId, userRole);
    }
}
