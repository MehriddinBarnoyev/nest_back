export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    meta?: any;
    error?: {
        message: string;
        code: string;
        details?: any;
    };
};
