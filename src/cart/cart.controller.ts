import { Controller, Post, Get, Delete, Body, UseGuards, Req, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../authorization/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('add')
  async addToCart(@Req() req: any, @Body() data: { productId: string; quantity?: number }) {
    const userId = req.user.sub;
    return this.cartService.addToCart(userId, data.productId, data.quantity);
  }

  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.sub;
    return this.cartService.getCart(userId);
  }

  @Delete('remove')
  async removeFromCart(@Req() req: any, @Body() data: { productId: string }) {
    const userId = req.user.sub;
    const cartItemId = data.productId; 
    return this.cartService.removeFromCart(userId, cartItemId);
  }

  @Patch('update-quantity')
  async updateQuantity(@Req() req: any, @Body() data: { productId: string; change: number }) {
    const userId = req.user.sub;
    return this.cartService.updateQuantity(userId, data.productId, data.change);
  }

  @Patch('favorites/toggle')
  async toggleFavorite(@Req() req: any, @Body('productId') productId: string) {
    return this.cartService.toggleFavorite(req.user.sub, productId);
  }

  @Get('favorites')
  async getFavorites(@Req() req: any) {
    return this.cartService.getFavoritesWithData(req.user.sub);
  }
}