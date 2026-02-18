"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const videos_service_1 = require("./videos.service");
const vdocipher_service_1 = require("./vdocipher.service");
const create_video_dto_1 = require("./dto/create-video.dto");
const update_video_dto_1 = require("./dto/update-video.dto");
const upload_credentials_dto_1 = require("./dto/upload-credentials.dto");
const ingest_youtube_dto_1 = require("./dto/ingest-youtube.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let VideosController = class VideosController {
    videosService;
    vdoCipherService;
    constructor(videosService, vdoCipherService) {
        this.videosService = videosService;
        this.vdoCipherService = vdoCipherService;
    }
    getUploadCredentials(dto) {
        return this.vdoCipherService.getUploadCredentials(dto.title, dto.folderId);
    }
    getVideoStatus(videoId) {
        return this.vdoCipherService.getVideoStatus(videoId);
    }
    create(dto, userId) {
        return this.videosService.create(dto, userId);
    }
    findAll(userId, userRole, page = 1, limit = 10, q) {
        return this.videosService.findAll(userId, userRole, page, limit, q);
    }
    findMyVideos(userId, userRole, page = 1, limit = 10, q) {
        return this.videosService.findAll(userId, userRole, page, limit, q);
    }
    findOne(id) {
        return this.videosService.findOne(id);
    }
    update(id, dto) {
        return this.videosService.update(id, dto);
    }
    ingestYoutube(dto, userId) {
        return this.videosService.ingestYoutube(dto.url, dto.title, dto.description, userId);
    }
    remove(id) {
        return this.videosService.remove(id);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Post)('upload-credentials'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get VdoCipher upload credentials',
        description: 'Returns upload credentials that the frontend can use to upload videos directly to VdoCipher'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_credentials_dto_1.GetUploadCredentialsDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "getUploadCredentials", null);
__decorate([
    (0, common_1.Get)(':videoId/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get VdoCipher video status',
        description: 'Check the processing status of a video on VdoCipher (Pre-Upload, Queued, or ready)'
    }),
    __param(0, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "getVideoStatus", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new video asset' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_video_dto_1.CreateVideoDto, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get video assets (Creator: own, Admin: all)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get videos created by current user' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, type: String }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(4, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findMyVideos", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get video asset by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update video asset' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_dto_1.UpdateVideoDto]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('ingest/youtube'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ingest YouTube video to database',
        description: 'Save YouTube video URL and description to database. Uses upsert to prevent duplicates based on video ID. Frontend handles preview via iframe.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ingest_youtube_dto_1.IngestYoutubeDto, String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "ingestYoutube", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete video asset' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "remove", null);
exports.VideosController = VideosController = __decorate([
    (0, swagger_1.ApiTags)('Videos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, common_1.Controller)('api/videos'),
    __metadata("design:paramtypes", [videos_service_1.VideosService,
        vdocipher_service_1.VdoCipherService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map