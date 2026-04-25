import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Review {
  @Prop({ required: true })
  user!: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating!: number;

  @Prop({ required: true })
  comment!: string;

  @Prop({ default: Date.now })
  date!: Date;
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ index: true })
  category!: string;

  @Prop({ default: 'assets/no-image.png' })
  imageUrl!: string;

  @Prop()
  description!: string;

  @Prop()
  brand!: string;

  @Prop({ default: 0, min: 0 })
  stock!: number;

  @Prop({ default: 5, min: 1, max: 5 })
  stars!: number;

  @Prop([Review])
  reviews!: Review[];

  @Prop([String])
  colors!: string[];

  @Prop([String])
  sizes!: string[];

  @Prop()
  weight!: number;

  @Prop()
  dimensions!: string;

  @Prop()
  material!: string;

  @Prop({ type: [String], index: true })
  tags!: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);