import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CacheService } from '../../common/services/cache.service';

@Injectable()
export class UserService {
  private readonly CACHE_KEY_PREFIX = 'user';
  private readonly CACHE_TTL = 3600;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    // Generate cache key for this user
    const cacheKey = this.cacheService.generateKey(this.CACHE_KEY_PREFIX, id);

    // Try to get from cache first
    const cachedUser = await this.cacheService.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    // If not in cache, get from database
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Store in cache for future requests
    await this.cacheService.set(cacheKey, user, this.CACHE_TTL);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // If trying to update username or email, check for conflicts
    if (userData.username || userData.email) {
      const existingUser = await this.userRepository.findOne({
        where: [
          userData.username ? { username: userData.username } : {},
          userData.email ? { email: userData.email } : {},
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    // Update user properties
    Object.assign(user, userData);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
