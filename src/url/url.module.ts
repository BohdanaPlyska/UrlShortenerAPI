import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from './controllers/url.controller';
import { Url, UrlEntitySchema } from './entities/url';
import { UrlRepository } from './repository/url.repository';
import { Counter, CounterSchema } from '../db/counter';
import { StatisticRepository } from './repository/statistic.repository';
import { StatisticListener } from './stat.listener';
import { Statistic, StatisticSchema } from './entities/statistic.entity';
import { UrlService } from './services/url.service';
import { UrlEncoderService } from './services/url-encoder.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Url.name, schema: UrlEntitySchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Statistic.name, schema: StatisticSchema },
    ]),
  ],
  controllers: [UrlController],
  providers: [
    UrlService,
    UrlRepository,
    StatisticRepository,
    StatisticListener,
    UrlEncoderService,
  ],
})
export class UrlModule {}
