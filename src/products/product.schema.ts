import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  category: string;

  @Prop()
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);