import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuoteService } from './quote.service';

@Module({
  imports: [HttpModule],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class ExternalModule {}
