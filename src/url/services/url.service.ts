import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UrlRepository } from '../repository/url.repository';
import { Url } from '../entities/url';
import { Statistic } from '../entities/statistic.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StatisticRepository } from '../repository/statistic.repository';
import { UrlEncoderService } from './url-encoder.service';
import { ListenerEvents } from '../const';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  constructor(
    private readonly shortUrlRepository: UrlRepository,
    private readonly statisticRepository: StatisticRepository,
    private readonly urlEncoderService: UrlEncoderService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(EventEmitter2) private eventEmitter: EventEmitter2,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  async createUrl(url: string): Promise<string> {
    const existingUrl = await this.shortUrlRepository.findByUrl(url);
    if (existingUrl) {
      return this.urlEncoderService.encodeId(existingUrl._id);
    }

    const savedUrl = await this.shortUrlRepository.createUrl(url);

    await this.cacheManager.set(
      savedUrl._id.toString(),
      url,
      this.configService.get('REDIS_TTL'),
    );

    return this.urlEncoderService.encodeId(savedUrl._id);
  }

  async getUrl(id: number): Promise<Url> {
    const cachedUrl = await this.cacheManager.get<Url>(id.toString());

    if (cachedUrl) {
      this.eventEmitter.emit(ListenerEvents.STATISTIC_EVENT, id);
      return cachedUrl;
    }

    const urlEntity = await this.shortUrlRepository.getUrlById(id);
    if (!urlEntity) {
      throw new NotFoundException('Url is not found');
    }

    await this.cacheManager.set(
      id.toString(),
      urlEntity.url,
      this.configService.get('REDIS_TTL'),
    );
    this.eventEmitter.emit(ListenerEvents.STATISTIC_EVENT, id);

    return urlEntity;
  }

  async getStatisticsForShortUrl(urlId: number): Promise<Statistic[]> {
    const statistics =
      await this.statisticRepository.getAllStatisticByUrlId(urlId);
    if (!statistics || statistics.length === 0) {
      throw new NotFoundException(
        'No statistics found for the provided URL ID.',
      );
    }
    return statistics;
  }
}
