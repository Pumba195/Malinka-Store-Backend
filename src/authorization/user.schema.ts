import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
        type: MongooseSchema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, default: 1 }
    }],
    default: []
  })
  cart!: { productId: any; quantity: number }[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }],
    default: []
  })
  favorites!: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);