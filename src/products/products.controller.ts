import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async getAll(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('sort') sort: string,
        @Query('search') search: string
    ) {
        return await this.productsService.findAll(limit, offset, sort, search);
    }

    @Post()
    async addProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Delete(':id')
    async removeProduct(@Param('id') id: string) {
        return this.productsService.delete(id);
    }
}