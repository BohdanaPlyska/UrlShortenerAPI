import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Url extends Document {
  @ApiProperty({
    description: 'The unique identifier of the URL',
    example: 1,
  })
  @Prop()
  _id: number;

  @ApiProperty({
    description: 'The original long URL',
    example: 'https://example.com',
  })
  @Prop({ required: true })
  url: string;
}

export const UrlEntitySchema = SchemaFactory.createForClass(Url);

UrlEntitySchema.pre('save', async function (next) {
  const doc = this as Url;
  const CounterModel = doc.model('Counter') as Model<any>;
  const counter = await CounterModel.findOneAndUpdate(
    { _id: 'url_id' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  doc._id = counter.seq;
  next();
});
