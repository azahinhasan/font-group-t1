import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FontDocument = Font & Document;

@Schema({ timestamps: true })
export class Font {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;
}

export const FontSchema = SchemaFactory.createForClass(Font);
