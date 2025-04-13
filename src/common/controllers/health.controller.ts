import { Controller, Get } from '@nestjs/common';
import { CacheService } from '../services/cache.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @ApiOperation({ summary: 'Check Redis connection health' })
  @ApiResponse({
    status: 200,
    description: 'Redis connection is healthy',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        originalValue: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', example: '2023-06-14T12:00:00.000Z' },
          },
        },
        retrievedValue: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', example: '2023-06-14T12:00:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Redis connection failed' })
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
