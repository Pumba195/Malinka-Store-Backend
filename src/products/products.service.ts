import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

    async findAll(): Promise<Product[]> {
        return this.productModel.find().exec();
    }
  
    async create(createProductDto: any): Promise<Product> {
        const newProduct = new this.productModel(createProductDto);
        return newProduct.save();
    }

    async delete(id: string): Promise<any> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        
        return { message: 'Product successfully deleted', id };
    }
}
