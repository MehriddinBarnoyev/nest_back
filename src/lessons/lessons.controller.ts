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
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Lessons')
@ApiBearerAuth()
@Controller('api')
export class LessonsController {
    constructor(private lessonsService: LessonsService) { }

    @Post('courses/:courseId/lessons')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new lesson for a course' })
    create(
        @Param('courseId', ParseUUIDPipe) courseId: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: CreateLessonDto,
    ) {
        return this.lessonsService.create(courseId, userId, userRole, dto);
    }

    @Get('courses/:courseId/lessons')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all lessons for a course' })
    findAll(@Param('courseId', ParseUUIDPipe) courseId: string) {
        return this.lessonsService.findAll(courseId);
    }

    @Patch('lessons/:id')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update a lesson' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: UpdateLessonDto,
    ) {
        return this.lessonsService.update(id, userId, userRole, dto);
    }

    @Delete('lessons/:id')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete a lesson' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.lessonsService.remove(id, userId, userRole);
    }
}
