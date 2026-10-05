import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'error', 'warn', 'info']
          : [],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connected succesfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected succesfully');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("can't clean database in production");
    }

    const models = Reflect.ownKeys(this).filter((key) => {
      typeof key === 'string' && !key.startsWith('_');
    });

    return Promise.all(
      models.map((modelKay) => {
        if (modelKay === 'string') {
          return this[modelKay].deleteMany();
        }
      }),
    );
  }
}
