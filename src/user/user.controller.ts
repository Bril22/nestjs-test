import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiCookieAuth('User')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all user
  @Get()
  getAllUser(@GetUser() user: User) {
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    // console.log('User:', user);
    return this.userService.findAllUser();
  }
  // getAllUser(@Req() req: Request) {
  //   const user = req.user;
  //   console.log('User from middleware:', user);
  //   return this.userService.findAllUser();
  // }

  // get one user
  @Get('user')
  getUser(@GetUser() user: User) {
    return user;
  }

  // edit user
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
