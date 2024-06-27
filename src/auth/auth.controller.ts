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
import { setAuthCookie } from 'src/utils';
import { FastifyRequest, FastifyReply } from 'fastify';
// import { UseBefore } from 'routing-controllers';
// import { CsrfMiddleware } from 'src/middleware';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Get('csrf-token')
  // getCsrfToken(@Req() req: Request, @Res() res: Response) {
  //   res.send({ csrfToken: req.csrfToken() });
  //   return res.send({ csrfToken: req.csrfToken() });
  // }

  @Get('csrf-token')
  getCsrfToken(@Req() req: Request, @Res() res: Response) {
    const token = req.csrfToken();
    res.cookie('XSRF-TOKEN', token, { httpOnly: false });
    res.send({ csrfToken: token });
  }

  // signup
  @Post('signup')
  async signup(
    @Body() dto: AuthDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const result = await this.authService.signup(dto);
    setAuthCookie(res, result.access_token);
    // res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
    return res.send({ status: 'ok', ...result });
  }

  // signin
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  // async signin(
  //   @Body() dto: AuthDto,
  //   @Req() req: FastifyRequest,
  //   @Res() res: FastifyReply,
  // ) {
  //   const result = await this.authService.signin(dto);
  //   setAuthCookie(res, result.access_token);
  //   // res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false });
  //   return res.send({ status: 'ok', ...result });
  // }
  async signin(
    @Body() dto: AuthDto,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const result = await this.authService.signin(dto);
    req.session.set('user', { id: result.userId });
    res.setCookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.send({ status: 'ok', ...result });
  }

  // logout
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Post('logout')
  // async logout(@Res() res: FastifyReply) {
  //   res.clearCookie('access_token');
  //   res.clearCookie('XSRF-TOKEN');
  //   res.clearCookie('_csrf');
  //   return res.send({ message: 'Logged out successfully' });
  // }
  async logout(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    req.session.delete();
    res.clearCookie('access_token');
    res.clearCookie('test');
    res.clearCookie('session');
    res.send({ message: 'Logged out successfully' });
  }
}
