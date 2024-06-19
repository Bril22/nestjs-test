import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // Post
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  // signup(
  //     @Body('email') email: string,
  //     @Body('password', ParseIntPipe) password: number) {
  //     console.log({
  //         email,
  //         typeEmail: typeof email,
  //         password,
  //         typePassword: typeof password
  //     })
  //     return this.authService.signup()
  // }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
