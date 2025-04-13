import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface ErrorReport {
  exception: unknown;
  request: {
    url: string;
    method: string;
    headers: Record<string, any>;
    body: any;
    query: Record<string, any>;
    params: Record<string, any>;
  };
  timestamp: string;
}

@Injectable()
export class ErrorReportingService {
  private readonly logger = new Logger('ErrorReportingService');
  private readonly errorLogPath: string;

  constructor() {
    // Configure error log file path
    this.errorLogPath = path.join(process.cwd(), 'logs', 'errors.log');

    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  /**
   * Reports an error by logging it to a file and potentially sending it to external services
   */
  reportError(errorReport: ErrorReport): void {
    try {
      // Format the error for logging
      const errorLog = this.formatErrorReport(errorReport);

      // Write to error log file
      fs.appendFileSync(this.errorLogPath, errorLog + '\n');

      // Here you could also send the error to external services like Sentry, Datadog, etc.
      // this.sendToExternalService(errorReport);

      this.logger.debug('Error reported and logged successfully');
    } catch (error) {
      this.logger.error(
        'Failed to report error',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  /**
   * Format the error report into a readable string
   */
  private formatErrorReport(errorReport: ErrorReport): string {
    const { exception, request, timestamp } = errorReport;

    // Create a sanitized version of the request object without sensitive data
    const sanitizedRequest = {
      url: request.url,
      method: request.method,
      query: request.query,
      params: request.params,
      // Omit headers and body to prevent logging sensitive data
    };

    // Format exception details
    let exceptionDetails = 'Unknown error';
    if (exception instanceof Error) {
      exceptionDetails = `${exception.name}: ${exception.message}\n${exception.stack || ''}`;
    } else if (exception !== null && exception !== undefined) {
      exceptionDetails = JSON.stringify(exception, null, 2);
    }

    // Combine everything into a formatted log entry
    return `
    [${timestamp}] ERROR: 
Request: ${JSON.stringify(sanitizedRequest)}
Exception: ${exceptionDetails}
----------------------------------------
`;
  }
}
