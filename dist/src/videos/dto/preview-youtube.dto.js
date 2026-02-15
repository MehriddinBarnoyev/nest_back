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
exports.PreviewYoutubeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PreviewYoutubeDto {
    url;
}
exports.PreviewYoutubeDto = PreviewYoutubeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'YouTube video URL (supports youtube.com/watch, youtu.be, and youtube.com/shorts formats)',
    }),
    (0, class_validator_1.IsUrl)({}, { message: 'Please provide a valid URL' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], PreviewYoutubeDto.prototype, "url", void 0);
//# sourceMappingURL=preview-youtube.dto.js.map