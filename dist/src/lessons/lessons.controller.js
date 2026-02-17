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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const lessons_service_1 = require("./lessons.service");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../common/decorators/public.decorator");
let LessonsController = class LessonsController {
    lessonsService;
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    create(courseId, userId, userRole, dto) {
        return this.lessonsService.create(courseId, userId, userRole, dto);
    }
    findAll(courseId) {
        return this.lessonsService.findAll(courseId);
    }
    update(id, userId, userRole, dto) {
        return this.lessonsService.update(id, userId, userRole, dto);
    }
    remove(id, userId, userRole) {
        return this.lessonsService.remove(id, userId, userRole);
    }
    findOnePublic(id, userId) {
        return this.lessonsService.findOnePublic(id, userId);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, common_1.Post)('courses/:courseId/lessons'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new lesson for a course' }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('courses/:courseId/lessons'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lessons for a course' }),
    __param(0, (0, common_1.Param)('courseId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)('lessons/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a lesson' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_lesson_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('lessons/:id'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a lesson' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "remove", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('public/lessons/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a lesson (public access with entitlement check)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findOnePublic", null);
exports.LessonsController = LessonsController = __decorate([
    (0, swagger_1.ApiTags)('Lessons'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map