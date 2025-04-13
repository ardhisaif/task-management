import { Module, Global } from '@nestjs/common';
import { ErrorReportingService } from './services/error-reporting.service';
import { CacheService } from './services/cache.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { HealthController } from './controllers/health.controller';

@Global()
@Module({
  controllers: [HealthController],
  providers: [
    ErrorReportingService,
    CacheService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [ErrorReportingService, CacheService],
})
export class CommonModule {}
