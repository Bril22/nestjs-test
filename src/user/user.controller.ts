import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('user')
    // async findOne(@GetUser() user: User) {
    //     return user
    // }
    getUser(@GetUser() user: User) {
        return user;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number,
        @Body() dto: EditUserDto
    ) {
        return this.userService.editUser(userId, dto)
    }
}