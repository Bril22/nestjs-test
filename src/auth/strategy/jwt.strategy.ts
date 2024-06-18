import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "nestjs-prisma";
import { ExtractJwt, Strategy } from "passport-jwt";
import { tokenDto } from "../dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    'jwt'
) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: tokenDto) {
        // console.log({
        //    payload
        // })
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: payload.userId,
                    email: payload.email
                },
            });
        delete user.hash;
        return user;
    }
}