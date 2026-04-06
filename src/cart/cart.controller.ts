import { Controller, Post, Get, Delete, Body, UseGuards, Req, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../authorization/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // POST http://localhost:3000/cart/add
  @Post('add')
  async addToCart(@Req() req: any, @Body() data: { productId: string; quantity?: number }) {
    const userId = req.user.sub; 
    return this.cartService.addToCart(userId, data.productId, data.quantity);
  }

  // GET http://localhost:3000/cart
  @Get()
  async getCart(@Req() req: any) {
    const userId = req.user.sub;
    return this.cartService.getCart(userId);
  }

  // DELETE http://localhost:3000/cart/remove
  @Delete('remove')
  async removeFromCart(@Req() req: any, @Body() data: { productId: string }) {
    const userId = req.user.sub;
    return this.cartService.removeFromCart(userId, data.productId);
  }

  @Patch('update-quantity')
  async updateQuantity(@Req() req: any, @Body() data: { productId: string; change: number}) {
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