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
exports.CreatorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const creators_service_1 = require("./creators.service");
const create_creator_profile_dto_1 = require("./dto/create-creator-profile.dto");
const update_creator_profile_dto_1 = require("./dto/update-creator-profile.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let CreatorsController = class CreatorsController {
    creatorsService;
    constructor(creatorsService) {
        this.creatorsService = creatorsService;
    }
    createMyProfile(userId, dto) {
        return this.creatorsService.createProfile(userId, dto);
    }
    getMyProfile(userId) {
        return this.creatorsService.getMyProfile(userId);
    }
    updateMyProfile(userId, dto) {
        return this.creatorsService.updateMyProfile(userId, dto);
    }
    deleteMyProfile(userId) {
        return this.creatorsService.deleteMyProfile(userId);
    }
};
exports.CreatorsController = CreatorsController;
__decorate([
    (0, common_1.Post)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Create creator profile for current user' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_creator_profile_dto_1.CreateCreatorProfileDto]),
    __metadata("design:returntype", void 0)
], CreatorsController.prototype, "createMyProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get current creator profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreatorsController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update current creator profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_creator_profile_dto_1.UpdateCreatorProfileDto]),
    __metadata("design:returntype", void 0)
], CreatorsController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete current creator profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CreatorsController.prototype, "deleteMyProfile", null);
exports.CreatorsController = CreatorsController = __decorate([
    (0, swagger_1.ApiTags)('Creators'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/creators'),
    __metadata("design:paramtypes", [creators_service_1.CreatorsService])
], CreatorsController);
//# sourceMappingURL=creators.controller.js.map