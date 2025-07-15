// font-group.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Font } from '../font/font.schema';

export type FontGroupDocument = FontGroup & Document;

@Schema({ timestamps: true })
export class FontGroup {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Font.name }],
    validate: [
      (val: Types.ObjectId[]) => val.length >= 2,
      'Font group must contain at least 2 fonts',
    ],
    required: true,
  })
  fonts: Types.ObjectId[];
}

export const FontGroupSchema = SchemaFactory.createForClass(FontGroup);
