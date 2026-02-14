import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../types/api-response.type';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                // Handle cases where data is already in the expected format (e.g. from a previous interceptor)
                if (data && data.success !== undefined) {
                    return data;
                }

                // Special handling for pagination
                let meta = undefined;
                if (data && data.results !== undefined && data.meta !== undefined) {
                    meta = data.meta;
                    data = data.results;
                }

                return {
                    success: true,
                    data,
                    meta,
                };
            }),
        );
    }
}
