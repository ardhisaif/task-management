import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: { authorization?: string }; user?: any }>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization token');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Define the expected structure of the decoded token
      interface DecodedToken {
        sub: string;
        username: string;
        role: string;
      }

      const decoded = this.jwtService.verify<DecodedToken>(token, {
        secret: process.env.JWT_SECRET,
      });

      // Add user information to the request object
      request.user = {
        userId: decoded.sub,
        username: decoded.username,
        role: decoded.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
