import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreatorsModule } from './creators/creators.module';
import { CoursesModule } from './courses/courses.module';
import { SectionsModule } from './sections/sections.module';
import { LessonsModule } from './lessons/lessons.module';
import { VideosModule } from './videos/videos.module';
import { AccessRequestsModule } from './access-requests/access-requests.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { HealthController } from './health.controller';
import { validate } from './config/env.validation';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CreatorsModule,
    CoursesModule,
    SectionsModule,
    LessonsModule,
    VideosModule,
    AccessRequestsModule,
    InvoicesModule,
    PaymentsModule,
  ],

  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule { }
