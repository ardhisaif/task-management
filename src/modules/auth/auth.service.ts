import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Partial<User>): Promise<Omit<User, 'password'>> {
    if (!userData.password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    console.log(hashedPassword);

    userData.password = hashedPassword;
    userData.role = 'user'; // Set default role to "user"
    const user = await this.userService.create(userData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user; // Exclude password from the response
    return result;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User): { accessToken: string } {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  verifyRole(user: User, roles: string[]): void {
    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('Access denied');
    }
  }
}
