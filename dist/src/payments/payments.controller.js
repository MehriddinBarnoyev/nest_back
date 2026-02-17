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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const init_payment_dto_1 = require("./dto/init-payment.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    initPayment(userId, dto) {
        return this.paymentsService.initPayment(userId, dto);
    }
    paymeCallback(payload) {
        return this.paymentsService.handleCallback(client_1.PaymentProvider.PAYME, payload);
    }
    clickPrepare(payload) {
        return { error: 0, error_note: 'Success' };
    }
    clickComplete(payload) {
        return this.paymentsService.handleCallback(client_1.PaymentProvider.CLICK, payload);
    }
    confirmPayment(paymentId, userId, userRole) {
        return this.paymentsService.confirmPayment(paymentId, userId, userRole);
    }
    findForOwner(ownerUserId, userRole, courseId, status, dateFrom, dateTo, page, limit) {
        return this.paymentsService.findForOwner(ownerUserId, userRole, courseId, status, dateFrom ? new Date(dateFrom) : undefined, dateTo ? new Date(dateTo) : undefined, page ? +page : 1, limit ? +limit : 10);
    }
    getProgressReport(ownerUserId, userRole, courseId, page, limit) {
        return this.paymentsService.getProgressReport(ownerUserId, userRole, courseId, page ? +page : 1, limit ? +limit : 10);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('payments/init'),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate payment for an invoice' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, init_payment_dto_1.InitPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "initPayment", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('payme/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'Payme webhook callback' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "paymeCallback", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('click/prepare'),
    (0, swagger_1.ApiOperation)({ summary: 'Click prepare callback' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "clickPrepare", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('click/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Click complete callback' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "clickComplete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('payments/:id/confirm'),
    (0, swagger_1.ApiOperation)({ summary: 'Confirm a pending payment (Mock flow)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "confirmPayment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('owner/payments'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List payments for my courses' }),
    (0, swagger_1.ApiQuery)({ name: 'courseId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: client_1.PaymentStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('courseId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('page')),
    __param(7, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findForOwner", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('owner/progress'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.CREATOR, client_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get student progress report for a course' }),
    (0, swagger_1.ApiQuery)({ name: 'courseId', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('role')),
    __param(2, (0, common_1.Query)('courseId', common_1.ParseUUIDPipe)),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getProgressReport", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map