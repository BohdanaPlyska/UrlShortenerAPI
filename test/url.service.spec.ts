import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from '../src/url/services/url.service';
import { Model } from 'mongoose';
import { Url } from '../src/url/entities/url';
import { getModelToken } from '@nestjs/mongoose';
import { UrlRepository } from "../src/url/repository/url.repository";
import { StatisticRepository } from "../src/url/repository/statistic.repository";
import { UrlEncoderService } from "../src/url/services/url-encoder.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { EventEmitter2 } from "@nestjs/event-emitter";

describe('URL Service Tests', () => {
  let urlService: UrlService;
  let urlModel: Model<Url>;

  const mockUrlService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        UrlEncoderService,
        EventEmitter2,
        { provide: CACHE_MANAGER, useValue: {} as any },
        {
          provide: UrlRepository,
          useValue: {},
        },
        {
          provide: StatisticRepository,
          useValue: {},
        },
        {
          provide: getModelToken(Url.name),
          useValue: mockUrlService,
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlModel = module.get<Model<Url>>(getModelToken(Url.name));
  });

  describe('Create URL Service', () => {
    it('should create a Url', async () => {
      const newUrl = {
        url: 'https://example.com/hhhhhhhhhhhhhhh',
      };

      const mockCreatedUrl = { _id: 'someId', ...newUrl };

      jest.spyOn(urlModel, 'create').mockRejectedValueOnce(mockCreatedUrl);

      const result = await urlService.createUrl(newUrl.url);
      expect(result).toEqual(mockCreatedUrl._id);
    });
  });
});
