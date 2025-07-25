import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LoggingDocument = Logging & Document;

@Schema({ timestamps: true })
export class Logging {
  @Prop({ required: true })
  requestType: string;

  @Prop({ required: true })
  status: string;
}

export const LoggingSchema = SchemaFactory.createForClass(Logging);
