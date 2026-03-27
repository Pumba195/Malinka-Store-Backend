import { IsString, IsNumber, Min, IsUrl, IsNotEmpty, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title is too short' })
  readonly title: string;

  @IsNumber()
  @Min(1, { message: 'Price must be greater than 0' })
  readonly price: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  readonly category: string;

  @IsUrl({}, { message: 'ImageUrl must be a valid URL' })
  readonly imageUrl: string;
}  