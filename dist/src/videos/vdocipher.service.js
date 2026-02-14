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
var VdoCipherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VdoCipherService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let VdoCipherService = VdoCipherService_1 = class VdoCipherService {
    httpService;
    configService;
    logger = new common_1.Logger(VdoCipherService_1.name);
    apiSecret;
    baseUrl = 'https://dev.vdocipher.com/api';
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        const secret = this.configService.get('VDO_SECRET_KEY');
        if (!secret) {
            throw new Error('VDO_SECRET_KEY is not configured');
        }
        this.apiSecret = secret;
    }
    async getUploadCredentials(title, folderId) {
        try {
            this.logger.debug(`Requesting upload credentials for video: ${title}`);
            const params = { title };
            if (folderId) {
                params.folderId = folderId;
            }
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.put(`${this.baseUrl}/videos`, null, {
                params,
                headers: {
                    Authorization: `Apisecret ${this.apiSecret}`,
                },
            }));
            this.logger.debug(`Upload credentials obtained for video ID: ${response.data.videoId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('Failed to get upload credentials from VdoCipher', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Failed to get upload credentials. Please try again later.');
        }
    }
    async getVideoStatus(videoId) {
        try {
            this.logger.debug(`Fetching status for video ID: ${videoId}`);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.baseUrl}/videos/${videoId}`, {
                headers: {
                    Authorization: `Apisecret ${this.apiSecret}`,
                    Accept: 'application/json',
                },
            }));
            this.logger.debug(`Video status: ${response.data.status}`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Failed to get video status for ID: ${videoId}`, error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Failed to get video status. Please try again later.');
        }
    }
};
exports.VdoCipherService = VdoCipherService;
exports.VdoCipherService = VdoCipherService = VdoCipherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], VdoCipherService);
//# sourceMappingURL=vdocipher.service.js.map