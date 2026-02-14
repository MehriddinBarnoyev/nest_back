import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SectionsService } from './sections.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Sections')
@ApiBearerAuth()
@Controller('api')
export class SectionsController {
    constructor(private sectionsService: SectionsService) { }

    @Post('courses/:courseId/sections')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new section for a course' })
    create(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: CreateSectionDto,
    ) {
        return this.sectionsService.create(courseId, userId, userRole, dto);
    }

    @Get('courses/:courseId/sections')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all sections for a course' })
    findAll(@Param('courseId', ParseUUIDPipe) courseId: string) {
        return this.sectionsService.findAll(courseId);
    }

    @Patch('sections/:id')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update a section' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: UpdateSectionDto,
    ) {
        return this.sectionsService.update(id, userId, userRole, dto);
    }

    @Delete('sections/:id')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete a section' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.sectionsService.remove(id, userId, userRole);
    }
}
