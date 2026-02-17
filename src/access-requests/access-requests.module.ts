import { Module } from '@nestjs/common';
import { AccessRequestsService } from './access-requests.service';
import { AccessRequestsController } from './access-requests.controller';
import { InvoicesModule } from '../invoices/invoices.module';

@Module({
    imports: [InvoicesModule],
    providers: [AccessRequestsService],
    controllers: [AccessRequestsController],
    exports: [AccessRequestsService],
})
export class AccessRequestsModule { }
