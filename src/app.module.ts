import { Module } from '@nestjs/common';
import { PostsModule } from './modules/posts/posts.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PostsModule,
    UserModule,
    BookmarkModule,
    AuthModule
  ],
})
export class AppModule { }
