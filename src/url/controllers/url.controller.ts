import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Url } from '../entities/url';
import { Statistic } from '../entities/statistic.entity';
import { UrlService } from '../services/url.service';
import { UrlEncoderService } from '../services/url-encoder.service';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('URL Shortener')
@Controller('api/shorten')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly urlEncoderService: UrlEncoderService,
  ) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a short URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        longUrl: {
          type: 'string',
          example: 'https://example.com',
          description: 'The original URL that needs to be shortened.',
        },
      },
      required: ['longUrl'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The shortened URL code is successfully created.',
    schema: {
      type: 'string',
      example: 'abc123',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid URL provided.' })
  async createShortUrl(@Body('longUrl') longUrl: string): Promise<string> {
    return this.urlService.createUrl(longUrl);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Retrieve the original URL by short code' })
  @ApiParam({
    name: 'code',
    description: 'The short URL code used to retrieve the original URL.',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'The original URL associated with the given code.',
    type: Url,
  })
  @ApiResponse({
    status: 404,
    description: 'No URL found for the provided code.',
  })
  async getOriginalUrl(@Param('code') code: string): Promise<string> {
    const decodedId = this.urlEncoderService.decodeShortUrl(code);
    return this.urlService.getUrl(decodedId);
  }

  @Get('stats/:code')
  @ApiOperation({ summary: 'Get statistics for a short URL' })
  @ApiParam({
    name: 'code',
    description: 'The short URL code for which to retrieve statistics.',
    example: 'abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics for the short URL.',
    type: [Statistic],
  })
  @ApiResponse({
    status: 404,
    description: 'No statistics found for the provided code.',
  })
  async getStatistic(@Param('code') code: string): Promise<Statistic[]> {
    const decodedId = this.urlEncoderService.decodeShortUrl(code);
    return this.urlService.getStatisticsForShortUrl(decodedId);
  }
}
