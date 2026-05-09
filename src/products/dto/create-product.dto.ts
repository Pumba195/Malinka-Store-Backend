import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsUrl,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

class ReviewDto {
  @IsString()
  user!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  comment!: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title is too short' })
  readonly title!: string;

  @IsNumber()
  @Min(0, { message: 'Price must be 0 or greater' })
  readonly price!: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  readonly category!: string;

  @IsUrl({}, { message: 'ImageUrl must be a valid URL' })
  @IsOptional()
  readonly imageUrl?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly brand?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly stock?: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  readonly stars?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly colors?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly sizes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags?: string[];

  @IsString()
  @IsOptional()
  readonly material?: string;

  @IsNumber()
  @IsOptional()
  readonly weight?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  readonly reviews?: ReviewDto[];
}