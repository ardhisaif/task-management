import { Controller, Get } from '@nestjs/common';
import { CacheService } from '../services/cache.service';

@Controller('health')
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('redis')
  async testRedis() {
    const testKey = 'test:health:redis';
    const testValue = { status: 'ok', timestamp: new Date().toISOString() };

    // Set value in cache
    await this.cacheService.set(testKey, testValue, 60);

    // Get value from cache
    const retrieved = await this.cacheService.get(testKey);

    // Delete the test key
    await this.cacheService.delete(testKey);

    return {
      success: JSON.stringify(retrieved) === JSON.stringify(testValue),
      originalValue: testValue,
      retrievedValue: retrieved,
    };
  }
}
