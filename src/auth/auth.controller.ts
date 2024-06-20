import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';
import { JwtGuard } from './guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // signup
  @Post('signup')
  async signup(@Body() dto: AuthDto, @Res() res: Response) {
    const result = await this.authService.signup(dto);
    const token = result.access_token;

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
    return res.send(result);
  }

  // signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Res() res: Response) {
    const result = await this.authService.signin(dto);
    const token = result.access_token;
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
    // return res.send(result);
  }

  // logout
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out successfully' });
  }

  @ApiBearerAuth()
  @Get('protected')
  getProtected(@Req() req: Request) {
    return req.user;
  }
}
