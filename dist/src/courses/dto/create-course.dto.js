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
exports.CreateCourseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateCourseDto {
    title;
    slug;
    description;
    status;
    visibility;
    priceType;
    priceAmount;
    currency;
    tags;
}
exports.CreateCourseDto = CreateCourseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NestJS for Advanced Developers' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'nestjs-advanced', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Learn advanced NestJS patterns', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: client_1.CourseStatus.DRAFT, enum: client_1.CourseStatus, required: false }),
    (0, class_validator_1.IsEnum)(client_1.CourseStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: client_1.CourseVisibility.PUBLIC, enum: client_1.CourseVisibility, required: false }),
    (0, class_validator_1.IsEnum)(client_1.CourseVisibility),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "visibility", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ONE_TIME', enum: ['ONE_TIME', 'SUBSCRIPTION', 'FREE'] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "priceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4900, description: 'Price in cents' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCourseDto.prototype, "priceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['backend', 'typescript'], required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "tags", void 0);
//# sourceMappingURL=create-course.dto.js.map