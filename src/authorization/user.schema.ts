import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    type: [{
      productId: { 
        type: String, 
        ref: 'Product',
        required: true 
      },
      quantity: { type: Number, default: 1 }
    }],
    default: []
  })
  cart!: { productId: any; quantity: number }[];

  @Prop({ type: [String], default: [] })
  favorites!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);