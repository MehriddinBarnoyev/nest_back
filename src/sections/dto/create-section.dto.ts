import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSectionDto {
    @ApiProperty({ example: 'Introduction' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    orderNo: number;
}
