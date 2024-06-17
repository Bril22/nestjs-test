import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AuthDto } from './dto';
import * as argon from "argon2"

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    signin() {
        return {
            test: "you signin"
        }
    }

    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                firstName: dto.firstName,
                lastName: dto.lastName
            }
        })
        return user;
    }
}
