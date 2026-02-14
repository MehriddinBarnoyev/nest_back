import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController, PublicCoursesController } from './courses.controller';

@Module({
    controllers: [CoursesController, PublicCoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CoursesModule { }
