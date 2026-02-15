"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var YoutubeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const common_1 = require("@nestjs/common");
let YoutubeService = YoutubeService_1 = class YoutubeService {
    logger = new common_1.Logger(YoutubeService_1.name);
    parseVideoId(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                const videoId = urlObj.pathname.slice(1).split('?')[0];
                if (videoId)
                    return videoId;
            }
            if (urlObj.hostname.includes('youtube.com')) {
                const vParam = urlObj.searchParams.get('v');
                if (vParam)
                    return vParam;
                const shortsMatch = urlObj.pathname.match(/^\/shorts\/([^/?]+)/);
                if (shortsMatch)
                    return shortsMatch[1];
                const embedMatch = urlObj.pathname.match(/^\/embed\/([^/?]+)/);
                if (embedMatch)
                    return embedMatch[1];
            }
            throw new Error('Invalid YouTube URL format');
        }
        catch (error) {
            this.logger.error(`Failed to parse YouTube URL: ${url}`, error.message);
            throw new common_1.BadRequestException('Invalid YouTube URL. Please provide a valid YouTube video link.');
        }
    }
    toEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
};
exports.YoutubeService = YoutubeService;
exports.YoutubeService = YoutubeService = YoutubeService_1 = __decorate([
    (0, common_1.Injectable)()
], YoutubeService);
//# sourceMappingURL=youtube.service.js.map