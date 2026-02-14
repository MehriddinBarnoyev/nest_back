import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreatorsService } from './creators.service';
import { CreateCreatorProfileDto } from './dto/create-creator-profile.dto';
import { UpdateCreatorProfileDto } from './dto/update-creator-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Creators')
@ApiBearerAuth()
@Controller('api/creators')
export class CreatorsController {
    constructor(private creatorsService: CreatorsService) { }

    @Post('me')
    @ApiOperation({ summary: 'Create creator profile for current user' })
    createMyProfile(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateCreatorProfileDto,
    ) {
        return this.creatorsService.createProfile(userId, dto);
    }

    @Get('me')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Get current creator profile' })
    getMyProfile(@CurrentUser('id') userId: string) {
        return this.creatorsService.getMyProfile(userId);
    }

    @Patch('me')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update current creator profile' })
    updateMyProfile(
        @CurrentUser('id') userId: string,
        @Body() dto: UpdateCreatorProfileDto,
    ) {
        return this.creatorsService.updateMyProfile(userId, dto);
    }

    @Delete('me')
    @Roles(UserRole.CREATOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete current creator profile' })
    deleteMyProfile(@CurrentUser('id') userId: string) {
        return this.creatorsService.deleteMyProfile(userId);
    }
}
