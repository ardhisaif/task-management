import { Module, Global } from '@nestjs/common';
import { ErrorReportingService } from './services/error-reporting.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Global()
@Module({
  providers: [
    ErrorReportingService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
  exports: [ErrorReportingService],
})
export class CommonModule {}
