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
exports.UploadCredentialsResponseDto = exports.GetUploadCredentialsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class GetUploadCredentialsDto {
    title;
    folderId;
}
exports.GetUploadCredentialsDto = GetUploadCredentialsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My Video Title', description: 'Title of the video' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetUploadCredentialsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ca038407e1b0xxxxxxxxxxxxxxxxxxxx',
        description: 'Optional folder ID to upload video into specific folder',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUploadCredentialsDto.prototype, "folderId", void 0);
class UploadCredentialsResponseDto {
    clientPayload;
    videoId;
}
exports.UploadCredentialsResponseDto = UploadCredentialsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Client payload containing upload credentials',
        example: {
            policy: 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbXX0=',
            key: 'videos/abc123/video.mp4',
            'x-amz-signature': 'signature-here',
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-date': '20240101T000000Z',
            'x-amz-credential': 'credential-here',
            uploadLink: 'https://s3-bucket-url.amazonaws.com'
        }
    }),
    __metadata("design:type", Object)
], UploadCredentialsResponseDto.prototype, "clientPayload", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1234567890',
        description: 'VdoCipher video ID'
    }),
    __metadata("design:type", String)
], UploadCredentialsResponseDto.prototype, "videoId", void 0);
//# sourceMappingURL=upload-credentials.dto.js.map