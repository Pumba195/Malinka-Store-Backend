import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    getAllProducts() {
        return this.productsService.findAll();
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