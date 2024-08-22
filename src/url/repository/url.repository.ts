import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from '../entities/url';
import { Model } from 'mongoose';

@Injectable()
export class UrlRepository {
  constructor(
    @InjectModel(Url.name)
    private readonly urlModel: Model<Url>,
  ) {}

  async createUrl(url: string): Promise<Url> {
    const createUrl = new this.urlModel({ url });
    return createUrl.save();
  }

  async getUrlById(id: number): Promise<Url | null> {
    return this.urlModel.findById(id).exec();
  }

  async findByUrl(url: string): Promise<Url | null> {
    return this.urlModel.findOne({ url }).exec();
  }
}
