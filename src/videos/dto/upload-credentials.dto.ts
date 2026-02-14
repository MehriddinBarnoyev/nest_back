import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetUploadCredentialsDto {
    @ApiProperty({ example: 'My Video Title', description: 'Title of the video' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'ca038407e1b0xxxxxxxxxxxxxxxxxxxx',
        description: 'Optional folder ID to upload video into specific folder',
        required: false
    })
    @IsString()
    @IsOptional()
    folderId?: string;
}

export class UploadCredentialsResponseDto {
    @ApiProperty({
        description: 'Client payload containing upload credentials',
        example: {
            policy: 'eyJleHBpcmF0aW9uIjoiMjAyNC0wMS0wMVQwMDowMDowMFoiLCJjb25kaXRpb25zIjpbXX0=',
            key: 'videos/abc123/video.mp4',
            'x-amz-signature': 'signature-here',
            'x-amz-algorithm': 'AWS4-HMAC-SHA256',
            'x-amz-date': '20240101T000000Z',
            'x-amz-credential': 'credential-here',
            uploadLink: 'https://s3-bucket-url.amazonaws.com'
        }
    })
    clientPayload: {
        policy: string;
        key: string;
        'x-amz-signature': string;
        'x-amz-algorithm': string;
        'x-amz-date': string;
        'x-amz-credential': string;
        uploadLink: string;
    };

    @ApiProperty({
        example: '1234567890',
        description: 'VdoCipher video ID'
    })
    videoId: string;
}
