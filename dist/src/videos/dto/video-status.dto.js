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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoStatusResponseDto = exports.PosterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PosterDto {
    width;
    height;
    posterUrl;
}
exports.PosterDto = PosterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 854 }),
    __metadata("design:type", Number)
], PosterDto.prototype, "width", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 480 }),
    __metadata("design:type", Number)
], PosterDto.prototype, "height", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://d1z78r8i505acl.cloudfront.net/poster/123456.480.jpeg' }),
    __metadata("design:type", String)
], PosterDto.prototype, "posterUrl", void 0);
class VideoStatusResponseDto {
    id;
    title;
    description;
    upload_time;
    length;
    status;
    posters;
    tags;
}
exports.VideoStatusResponseDto = VideoStatusResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234567890' }),
    __metadata("design:type", String)
], VideoStatusResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Video.mp4' }),
    __metadata("design:type", String)
], VideoStatusResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Video description' }),
    __metadata("design:type", String)
], VideoStatusResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1519700000 }),
    __metadata("design:type", Number)
], VideoStatusResponseDto.prototype, "upload_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 125, description: 'Video length in seconds' }),
    __metadata("design:type", Number)
], VideoStatusResponseDto.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ready',
        description: 'Video status: Pre-Upload, Queued, or ready',
        enum: ['Pre-Upload', 'Queued', 'ready']
    }),
    __metadata("design:type", String)
], VideoStatusResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PosterDto] }),
    __metadata("design:type", Array)
], VideoStatusResponseDto.prototype, "posters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['tag1', 'tag2'] }),
    __metadata("design:type", Array)
], VideoStatusResponseDto.prototype, "tags", void 0);
//# sourceMappingURL=video-status.dto.js.map