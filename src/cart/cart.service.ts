import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../authorization/user.schema';

@Injectable()
export class CartService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async addToCart(userId: string, productId: string, quantity: number = 1) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const itemIndex = user.cart.findIndex(item => item.productId === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }

        user.markModified('cart');
        return await user.save();
    }

    async removeFromCart(userId: string, productId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);

        await user.save();

        const populatedUser = await this.userModel
            .findById(userId)
            .populate('cart.productId')
            .exec();

        return populatedUser!.cart;
    }

    async updateQuantity(userId: string, productId: string, change: number) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += change;

            if (user.cart[itemIndex].quantity <= 0) {
                user.cart.splice(itemIndex, 1);
            }
        }

        await user.save();

        // Populate again to ensure frontend gets full product data
        const populatedUser = await this.userModel
            .findById(userId)
            .populate('cart.productId')
            .exec();

        return populatedUser!.cart;
    }

    async getCart(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .populate('cart.productId')
            .exec();

        if (!user) throw new NotFoundException('User not found');

        return user.cart;
    }
}