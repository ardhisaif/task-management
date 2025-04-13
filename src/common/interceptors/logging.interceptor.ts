import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        // Log successful responses without including the data
        this.logger.log(`Success: ${method} ${url} (${Date.now() - now}ms)`);
      }),
      catchError((err: Error) => {
        // Log error responses with the error message
        this.logger.error(
          `Error: ${method} ${url} - ${err.message || 'Internal server error'} (${Date.now() - now}ms)`,
          err.stack,
        );
        return throwError(() => err);
      }),
    );
  }
}
