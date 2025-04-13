import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
  constructor(
    message: string = 'An unexpected error occurred',
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    public readonly errorCode?: string,
    public readonly details?: unknown,
  ) {
    super(
      {
        message,
        errorCode,
        details,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class DatabaseException extends ApplicationException {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'DB_ERROR', details);
  }
}

export class ValidationException extends ApplicationException {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class ResourceNotFoundException extends ApplicationException {
  constructor(resourceType: string, resourceId: string | number) {
    super(
      `${resourceType} with ID ${resourceId} not found`,
      HttpStatus.NOT_FOUND,
      'RESOURCE_NOT_FOUND',
    );
  }
}

export class UnauthorizedException extends ApplicationException {
  constructor(message: string = 'Unauthorized access') {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}

export class ForbiddenException extends ApplicationException {
  constructor(message: string = 'Access forbidden') {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN');
  }
}
