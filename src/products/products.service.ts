import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

    async findAll(limit: number, offset: number, sort: string, search: string) {
        const query = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        let sortOption: any = {};
        switch (sort) {
            case 'price-asc': sortOption = { price: 1 }; break;
            case 'price-desc': sortOption = { price: -1 }; break;
            default: sortOption = { createdAt: -1 };
        }

        return await this.productModel
            .find(query)
            .sort(sortOption)
            .skip(Number(offset))
            .limit(Number(limit))
            .exec();
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
