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
import { VideosService } from './videos.service';
import { VdoCipherService } from './vdocipher.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { GetUploadCredentialsDto } from './dto/upload-credentials.dto';
import { IngestYoutubeDto } from './dto/ingest-youtube.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Videos')
@ApiBearerAuth()
@Roles(UserRole.CREATOR, UserRole.ADMIN)
@Controller('api/videos')
export class VideosController {
    constructor(
        private videosService: VideosService,
        private vdoCipherService: VdoCipherService,
    ) { }

    @Post('upload-credentials')
    @ApiOperation({
        summary: 'Get VdoCipher upload credentials',
        description: 'Returns upload credentials that the frontend can use to upload videos directly to VdoCipher'
    })
    getUploadCredentials(@Body() dto: GetUploadCredentialsDto) {
        return this.vdoCipherService.getUploadCredentials(dto.title, dto.folderId);
    }

    @Get(':videoId/status')
    @ApiOperation({
        summary: 'Get VdoCipher video status',
        description: 'Check the processing status of a video on VdoCipher (Pre-Upload, Queued, or ready)'
    })
    getVideoStatus(@Param('videoId') videoId: string) {
        return this.vdoCipherService.getVideoStatus(videoId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new video asset' })
    create(@Body() dto: CreateVideoDto, @CurrentUser('id') userId: string) {
        return this.videosService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all video assets' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'q', required: false, type: String })
    findAll(
        @Query('page', new ParseIntPipe({ optional: true })) page = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
        @Query('q') q?: string,
    ) {
        return this.videosService.findAll(page, limit, q);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get video asset by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.videosService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update video asset' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateVideoDto,
    ) {
        return this.videosService.update(id, dto);
    }

    @Post('ingest/youtube')
    @ApiOperation({
        summary: 'Ingest YouTube video to database',
        description: 'Save YouTube video URL and description to database. Uses upsert to prevent duplicates based on video ID. Frontend handles preview via iframe.',
    })
    ingestYoutube(
        @Body() dto: IngestYoutubeDto,
        @CurrentUser('id') userId: string,
    ) {
        return this.videosService.ingestYoutube(dto.url, dto.description, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete video asset' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.videosService.remove(id);
    }
}
