import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}