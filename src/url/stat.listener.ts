import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StatisticRepository } from './repository/statistic.repository';
import { ListenerEvents } from './const';

@Injectable()
export class StatisticListener {
  constructor(private readonly statisticRepository: StatisticRepository) {}

  @OnEvent(ListenerEvents.STATISTIC_EVENT)
  async createStatistic(urlId: number) {
    await this.statisticRepository.createStatistic(urlId);
  }
}
