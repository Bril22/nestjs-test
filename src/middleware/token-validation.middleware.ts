import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Token validation
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Token missing or malformed');
      throw new UnauthorizedException('Token missing or malformed');
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      console.log('Token valid:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.log('Token verification error:', err.message);
      throw new UnauthorizedException('Token invalid or expired');
    }
  }

  //   async use(req: Request, res: Response, next: NextFunction) {
  //     const token = req.cookies?.token;

  //     // Token validation
  //     if (!token) {
  //       throw new UnauthorizedException('Token missing');
  //     }
  //     try {
  //       const decoded = await this.jwtService.verifyAsync(token);
  //       req.user = decoded;
  //       next();
  //     } catch (err) {
  //       throw new UnauthorizedException('Token invalid or expired');
  //     }
  //   }
}
