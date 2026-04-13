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

        const itemIndex = user.cart.findIndex(item =>
            item.productId && item.productId.toString() === productId.toString()
        );

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ productId, quantity } as any);
        }

        user.markModified('cart');
        await user.save();

        const populatedUser = await this.userModel
            .findById(userId)
            .populate('cart.productId')
            .exec();

        return populatedUser!.cart;
    }

    async removeFromCart(userId: string, cartItemId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        user.cart = user.cart.filter(item => item._id.toString() !== cartItemId);

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

        const itemIndex = user.cart.findIndex(item =>
            item.productId && item.productId.toString() === productId
        );

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += change;

            if (user.cart[itemIndex].quantity <= 0) {
                user.cart.splice(itemIndex, 1);
            }

            user.markModified('cart');
        }

        await user.save();

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

    async toggleFavorite(userId: string, productId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const index = user.favorites.indexOf(productId as any);

        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(productId as any);
        }

        await user.save();

        const updatedUser = await this.userModel.findById(userId).populate('favorites');
        return updatedUser ? updatedUser.favorites : [];
    }

    async getFavoritesWithData(userId: string) {
        const user = await this.userModel
            .findById(userId)
            .populate('favorites')
            .exec();
        
        return user ? user.favorites : [];
    }
}