import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './modules/tasks/task.module';
import { UserModule } from './modules/users/user.module';
import { TaskLogModule } from './modules/task-logs/task-log.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Jangan gunakan di production
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000), // Exponential backoff
      },
      ttl: 300, // 5 minutes default TTL
      max: 1000, // Maximum number of items in cache
      commandsQueueMaxLength: 5000, // Optimize for high throughput
      pingInterval: 5000, // Check connection health every 5 seconds
      retryStrategy: (times) => Math.min(times * 500, 3000), // Retry on failure
      isolationPoolSize: 0.1, // 10% of connections reserved for important operations
    }),
    CommonModule,
    TaskModule,
    UserModule,
    TaskLogModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
