import { Module, Global } from '@nestjs/common';
import { ErrorReportingService } from './services/error-reporting.service';
import { CacheService } from './services/cache.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Global()
@Module({
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
