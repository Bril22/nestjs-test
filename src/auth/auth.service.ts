import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, tokenDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto): Promise<object> {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      const tokenData = {
        userId: user.id,
        email: user.email,
      };

      const token = await this.signToken(tokenData);
      return {
        token,
        message: 'Signup Successful',
      };
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw err;
    }
  }

  async signin(dto: AuthDto): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    const passMatch = await argon.verify(user.hash, dto.password);

    if (!passMatch) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const tokenData = {
      userId: user.id,
      email: user.email,
    };

    const access_token = await this.signToken(tokenData);
    return {
      access_token,
      message: 'Login Successful',
    };
  }

  async signToken(dto: tokenDto): Promise<string> {
    const payload = {
      sub: dto.userId,
      email: dto.email,
    };

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });
  }
}
