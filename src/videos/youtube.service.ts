import { Injectable, Logger, BadRequestException } from '@nestjs/common';

@Injectable()
export class YoutubeService {
    private readonly logger = new Logger(YoutubeService.name);

    /**
     * Parse YouTube video ID from various URL formats
     * Supports:
     * - https://www.youtube.com/watch?v=VIDEO_ID
     * - https://youtu.be/VIDEO_ID
     * - https://www.youtube.com/shorts/VIDEO_ID
     * - URLs with additional parameters (&t=, &list=, etc.)
     */
    parseVideoId(url: string): string {
        try {
            const urlObj = new URL(url);

            // Handle youtu.be format
            if (urlObj.hostname === 'youtu.be') {
                const videoId = urlObj.pathname.slice(1).split('?')[0];
                if (videoId) return videoId;
            }

            // Handle youtube.com/watch format
            if (urlObj.hostname.includes('youtube.com')) {
                // Check for /watch?v=
                const vParam = urlObj.searchParams.get('v');
                if (vParam) return vParam;

                // Check for /shorts/VIDEO_ID
                const shortsMatch = urlObj.pathname.match(/^\/shorts\/([^/?]+)/);
                if (shortsMatch) return shortsMatch[1];

                // Check for /embed/VIDEO_ID
                const embedMatch = urlObj.pathname.match(/^\/embed\/([^/?]+)/);
                if (embedMatch) return embedMatch[1];
            }

            throw new Error('Invalid YouTube URL format');
        } catch (error) {
            this.logger.error(`Failed to parse YouTube URL: ${url}`, error.message);
            throw new BadRequestException('Invalid YouTube URL. Please provide a valid YouTube video link.');
        }
    }

    /**
     * Generate YouTube embed URL
     */
    toEmbedUrl(videoId: string): string {
        return `https://www.youtube.com/embed/${videoId}`;
    }
}
