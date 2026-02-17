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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoices_service_1 = require("./invoices.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let InvoicesController = class InvoicesController {
    invoicesService;
    constructor(invoicesService) {
        this.invoicesService = invoicesService;
    }
    createFromRequest(requestId, ownerUserId, userRole, dto) {
        return this.invoicesService.createFromRequest(requestId, ownerUserId, userRole, dto);
    }
    send(id, ownerUserId, userRole) {
        return this.invoicesService.send(id, ownerUserId, userRole);
    }
    findMyInvoices(userId, status, page, limit) {
        return this.invoicesService.findMyInvoices(userId, status, page, limit);
    }
    findForOwner(ownerUserId, userRole, status, page, limit) {
        return this.invoicesService.findForOwner(ownerUserId, userRole, status, page, limit);
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Post)('owner/access-requests/:requestId/invoice'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create invoice for an access request' }),
    __param(0, (0, common_1.Param)('requestId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "createFromRequest", null);
__decorate([
    (0, common_1.Patch)('owner/invoices/:id/send'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Send invoice to student' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "send", null);
__decorate([
    (0, common_1.Get)('me/invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'List my invoices' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.InvoiceStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "findMyInvoices", null);
__decorate([
    (0, common_1.Get)('owner/invoices'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List invoices for my courses' }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.InvoiceStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "findForOwner", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map