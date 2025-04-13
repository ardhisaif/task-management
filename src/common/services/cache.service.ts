import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Get a value from cache
   * @param key Cache key
   * @returns Cached value or undefined if not found
   */
  async get<T>(key: string): Promise<T | undefined> {
    try {
      const result = await this.cacheManager.get<T>(key);
      return result === null ? undefined : result;
    } catch (error) {
      this.logger.error(
        `Error getting cache key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return undefined;
    }
  }

  /**
   * Set a value in cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttl Time to live in seconds (optional)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.cacheManager.set(key, value, ttl);
    } catch (error) {
      this.logger.error(
        `Error setting cache key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Delete a key from cache
   * @param key Cache key to delete
   */
  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
    } catch (error) {
      this.logger.error(
        `Error deleting cache key ${key}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Clear the entire cache
   */
  async reset(): Promise<void> {
    try {
      // Changed from reset to clear - the correct method name in newer Cache Manager versions
      await this.cacheManager.clear();
    } catch (error) {
      this.logger.error(
        `Error resetting cache: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Generate a standardized cache key
   * @param prefix Entity type prefix
   * @param id Entity identifier
   */
  generateKey(prefix: string, id: string | number): string {
    return `${prefix}:${id}`;
  }
}
