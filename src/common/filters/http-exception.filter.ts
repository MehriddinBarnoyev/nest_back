import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        let details: any = null;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse() as any;
            message = typeof res === 'string' ? res : res.message || res.error || message;
            code = `HTTP_${status}`;
            details = typeof res === 'object' ? res : null;
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            switch (exception.code) {
                case 'P2002':
                    status = HttpStatus.CONFLICT;
                    message = `Duplicate field value entered: ${exception.meta?.target}`;
                    code = 'PRISMA_P2002';
                    break;
                case 'P2025':
                    status = HttpStatus.NOT_FOUND;
                    message = 'Resource not found';
                    code = 'PRISMA_P2025';
                    break;
                default:
                    status = HttpStatus.BAD_REQUEST;
                    message = exception.message;
                    code = `PRISMA_${exception.code}`;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
        }

        response.status(status).json({
            success: false,
            error: {
                message,
                code,
                details,
            },
        });
    }
}
