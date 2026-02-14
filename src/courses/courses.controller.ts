import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    ParseUUIDPipe,
    ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Courses')
@Controller('api/courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) { }

    @Post()
    @ApiBearerAuth()
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new course' })
    create(@CurrentUser('id') userId: string, @Body() dto: CreateCourseDto) {
        return this.coursesService.create(userId, dto);
    }

    @Get()
    @ApiBearerAuth()
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get courses (Creator: own, Admin: all)' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'q', required: false, type: String })
    findAll(
        @CurrentUser() user: any,
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
        @Query('q') q?: string,
    ) {
        return this.coursesService.findAll(user, page, limit, q);
    }

    @Get(':id')
    @ApiBearerAuth()
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get course by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
        return this.coursesService.findOne(id, user);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update course' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
        @Body() dto: UpdateCourseDto,
    ) {
        return this.coursesService.update(id, userId, userRole, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete course' })
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') userRole: string,
    ) {
        return this.coursesService.remove(id, userId, userRole);
    }
}

@ApiTags('Public')
@Controller('api/public/courses')
export class PublicCoursesController {
    constructor(private coursesService: CoursesService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get published courses (Public)' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'q', required: false, type: String })
    findPublic(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
        @Query('q') q?: string,
    ) {
        return this.coursesService.findPublic(page, limit, q);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get published course by ID (Public)' })
    findOnePublic(@Param('id', ParseUUIDPipe) id: string) {
        return this.coursesService.findOnePublic(id);
    }
}
