import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin@platform.com', description: 'User email (admin@platform.com, creator@platform.com, student@platform.com)' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', description: 'User password (standard is 123456)' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

