import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenDto } from '../dto';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   JwtStrategy.extractJWTFromCookie,
      // ]),

      // use cookies
      // jwtfromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.token]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  // private static extractJWTFromCookie(req: Request): string | null {
  //   if (req.cookies && req.cookies.access_token) {
  //     return req.cookies.access_token;
  //   }
  //   return null;
  // }

  async validate(payload: tokenDto, req: Request): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId,
        email: payload.email,
      },
    });
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException();
    }
    req.user = user;
    return user;
  }
}
