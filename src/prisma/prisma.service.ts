import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get("DATABASE_URL")
        }
      }
    });
  }

  cleanDb() {
    return this.$transaction([
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }

  /**
   * The onModuleInit is optional — if you leave it out, Prisma will connect lazily on its first call to the database.
   */
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

}