import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Statistic } from '../entities/statistic.entity';

@Injectable()
export class StatisticRepository {
  constructor(
    @InjectModel(Statistic.name)
    private readonly statisticModel: Model<Statistic>,
  ) {}

  async createStatistic(urlId: number): Promise<Statistic> {
    const createUrlReq = new this.statisticModel({
      urlId,
      createdAt: new Date(),
    });
    return createUrlReq.save();
  }

  async getAllStatisticByUrlId(urlId: number): Promise<Statistic[]> {
    return this.statisticModel.find({ urlId }).exec();
  }
}
