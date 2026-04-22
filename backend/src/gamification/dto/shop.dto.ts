import { IsString, IsNumber, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreateShopItemTypeDto {
  @IsString()
  @MaxLength(255)
  item_type_name: string;

  @IsOptional()
  @IsString()
  item_type_description?: string;
}

export class CreateShopItemDto {
  @IsInt()
  shop_item_type_id: number;

  @IsString()
  @MaxLength(255)
  item_name: string;

  @IsOptional()
  @IsString()
  item_description?: string;

  @IsInt()
  item_price: number;
}
