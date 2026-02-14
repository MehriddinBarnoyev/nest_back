export declare class GetUploadCredentialsDto {
    title: string;
    folderId?: string;
}
export declare class UploadCredentialsResponseDto {
    clientPayload: {
        policy: string;
        key: string;
        'x-amz-signature': string;
        'x-amz-algorithm': string;
        'x-amz-date': string;
        'x-amz-credential': string;
        uploadLink: string;
    };
    videoId: string;
}
