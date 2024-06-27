import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { FastifyRequest, FastifyReply } from 'fastify';
import * as secureSession from '@fastify/secure-session';

@ApiCookieAuth('User')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all user
  @Get()
  // getAllUser(
  //   // @GetUser() user: User
  // ) {
  //   // if (!user) {
  //   //   throw new UnauthorizedException('Unauthorized');
  //   // }
  //   // console.log('User:', user);
  //   return this.userService.findAllUser();
  // }
  async getAllUsers(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    if (!req.session.get('user')) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    const users = await this.userService.findAllUser();
    res.send(users);
  }

  // get one user
  @Get('user')
  // getUser(@GetUser() user: User) {
  //   return user;
  // }
  async getUser(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @GetUser() user: User,
  ) {
    if (!req.session.get('user')) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    delete user.hash;
    res.send(user);
  }

  // edit user
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @Delete()
  deleteUser(@GetUser('id') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
