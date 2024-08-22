import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Statistic extends Document {
  @ApiProperty({
    description: 'The date when the statistic entry was created',
    example: '2023-01-01T12:00:00Z',
  })
  @Prop()
  createdAt: Date;

  @ApiProperty({
    description: 'The ID of the URL this statistic is related to',
    example: 1,
  })
  @Prop()
  urlId: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
