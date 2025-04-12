import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: string } }>();
    const user = request.user;

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('Access denied');
    }

    return true;
  }
}
