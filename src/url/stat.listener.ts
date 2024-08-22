import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StatisticRepository } from './repository/statistic.repository';

@Injectable()
export class StatisticListener {
  constructor(private readonly statisticRepository: StatisticRepository) {}

  @OnEvent('statisticEvent')
  async createStatistic(statisticId: number) {
    console.log(statisticId);
    await this.statisticRepository.createStatistic(statisticId);
  }
}
