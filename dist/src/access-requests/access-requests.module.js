"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRequestsModule = void 0;
const common_1 = require("@nestjs/common");
const access_requests_service_1 = require("./access-requests.service");
const access_requests_controller_1 = require("./access-requests.controller");
const invoices_module_1 = require("../invoices/invoices.module");
let AccessRequestsModule = class AccessRequestsModule {
};
exports.AccessRequestsModule = AccessRequestsModule;
exports.AccessRequestsModule = AccessRequestsModule = __decorate([
    (0, common_1.Module)({
        imports: [invoices_module_1.InvoicesModule],
        providers: [access_requests_service_1.AccessRequestsService],
        controllers: [access_requests_controller_1.AccessRequestsController],
        exports: [access_requests_service_1.AccessRequestsService],
    })
], AccessRequestsModule);
//# sourceMappingURL=access-requests.module.js.map