import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { CsrfMiddleware, TokenValidationMiddleware } from './middleware';
import { JwtModule } from '@nestjs/jwt';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    BookmarkModule,
    AuthModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    BooksModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenValidationMiddleware).forRoutes(
      { path: 'users', method: RequestMethod.ALL },
      { path: 'auth/protected', method: RequestMethod.ALL },
      { path: 'users/user', method: RequestMethod.ALL },
      // { path: '*', method: RequestMethod.ALL },
    );
    // consumer
    //   .apply(CsrfMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
