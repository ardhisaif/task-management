/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { AxiosError } from 'axios';

interface QuoteResponse {
  q: string; // quote text
  a: string; // author
  h?: string; // html format (optional)
}

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(private readonly httpService: HttpService) {}

  async getRandomQuote(): Promise<string | null> {
    try {
      const { data }: { data: QuoteResponse[] } = await firstValueFrom(
        this.httpService
          .get<QuoteResponse[]>('https://zenquotes.io/api/random')
          .pipe(
            catchError(
              (error: unknown): Observable<AxiosResponse<QuoteResponse[]>> => {
                const errorMessage =
                  error instanceof AxiosError
                    ? error.message
                    : error instanceof Error
                      ? error.message
                      : 'Unknown error';
                this.logger.error(`Error fetching quote: ${errorMessage}`);
                throw error;
              },
            ),
          ),
      );

      // The API returns an array with one quote object
      if (Array.isArray(data) && data.length > 0) {
        const quote: QuoteResponse = data[0];
        if (
          quote &&
          typeof quote.q === 'string' &&
          typeof quote.a === 'string'
        ) {
          return `"${quote.q}" - ${quote.a}`;
        }
      }
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Error in getRandomQuote: ${errorMessage}`);
      return null; // Return null if there's an error instead of throwing
    }
  }
}
