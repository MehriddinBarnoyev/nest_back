import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    fullName: dto.fullName,
                    role: dto.role,
                    isVerified: true, // Auto-verify for now to simplify testing
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    fullName: true,
                    isVerified: true,
                },
            });

            // If user is a creator, create a profile automatically
            if (dto.role === 'CREATOR') {
                await tx.creatorProfile.create({
                    data: {
                        userId: newUser.id,
                        displayName: dto.fullName || dto.email.split('@')[0],
                    },
                });
            }

            return newUser;
        });

        const token = this.generateToken(user);

        return { token, user };
    }


    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.generateToken(user);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...userWithoutPassword } = user;

        return { token, user: userWithoutPassword };
    }

    private generateToken(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
}
