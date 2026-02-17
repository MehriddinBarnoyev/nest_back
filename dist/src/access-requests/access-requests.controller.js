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
exports.AccessRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const access_requests_service_1 = require("./access-requests.service");
const create_access_request_dto_1 = require("./dto/create-access-request.dto");
const create_invoice_dto_1 = require("../invoices/dto/create-invoice.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AccessRequestsController = class AccessRequestsController {
    accessRequestsService;
    constructor(accessRequestsService) {
        this.accessRequestsService = accessRequestsService;
    }
    create(userId, dto) {
        return this.accessRequestsService.create(userId, dto);
    }
    findMyRequests(userId, status, page, limit) {
        return this.accessRequestsService.findMyRequests(userId, status, page, limit);
    }
    findForOwner(ownerUserId, userRole, status, courseId, q, dateFrom, dateTo, page, limit) {
        return this.accessRequestsService.findForOwner(ownerUserId, userRole, status, courseId, q, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, page ? +page : 1, limit ? +limit : 10);
    }
    accept(id, ownerUserId, userRole, dto) {
        return this.accessRequestsService.accept(id, ownerUserId, userRole, dto || {});
    }
    reject(id, ownerUserId, userRole) {
        return this.accessRequestsService.reject(id, ownerUserId, userRole);
    }
};
exports.AccessRequestsController = AccessRequestsController;
__decorate([
    (0, common_1.Post)('access-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new access request for a private course' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_access_request_dto_1.CreateAccessRequestDto]),
    __metadata("design:returntype", void 0)
], AccessRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me/access-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'List my access requests' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.AccessRequestStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AccessRequestsController.prototype, "findMyRequests", null);
__decorate([
    (0, common_1.Get)('owner/access-requests'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List access requests for my courses' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.AccessRequestStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'courseId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('courseId')),
    __param(4, (0, common_1.Query)('q')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AccessRequestsController.prototype, "findForOwner", null);
__decorate([
    (0, common_1.Patch)('owner/access-requests/:id/accept'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Accept an access request and create draft invoice for admin review' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], AccessRequestsController.prototype, "accept", null);
__decorate([
    (0, common_1.Patch)('owner/access-requests/:id/reject'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Reject an access request' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AccessRequestsController.prototype, "reject", null);
exports.AccessRequestsController = AccessRequestsController = __decorate([
    (0, swagger_1.ApiTags)('AccessRequests'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [access_requests_service_1.AccessRequestsService])
], AccessRequestsController);
//# sourceMappingURL=access-requests.controller.js.map