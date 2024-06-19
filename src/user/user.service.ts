import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';
import { UserEntity } from './entity';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    const userEntity = new UserEntity(user);
    return userEntity;
    // delete user.hash
    // return user
  }

  async findAllUser(): Promise<UserEntity[]> {
    const user = await this.prisma.user.findMany();
    return user.map((user) => new UserEntity(user));
    // return this.prisma.user.findMany()
  }
}
