import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCreatorProfileDto {
    @ApiProperty({ example: 'My Awesome Channel' })
    @IsString()
    @IsNotEmpty()
    displayName: string;

    @ApiProperty({ example: 'A brief bio about the creator', required: false })
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiProperty({ example: 'https://example.com', required: false })
    @IsUrl()
    @IsOptional()
    websiteUrl?: string;

    @ApiProperty({ example: { twitter: '@handle' }, required: false })
    @IsOptional()
    socialLinks?: any;
}
