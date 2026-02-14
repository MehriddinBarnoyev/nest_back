import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { VdoCipherService } from './vdocipher.service';

@Module({
    imports: [HttpModule],
    controllers: [VideosController],
    providers: [VideosService, VdoCipherService],
    exports: [VideosService],
})
export class VideosModule { }
