import { IsString, IsNumber, IsOptional, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';

export class CreateSpeciesCategoryDto {
  @IsString()
  @MaxLength(255)
  species_category_name: string;

  @IsOptional()
  @IsString()
  species_category_description?: string;
}

export class CreateSpeciesLevelDto {
  @IsString()
  @MaxLength(255)
  species_level_name: string;

  @IsOptional()
  @IsString()
  species_level_description?: string;
}

export class CreateSpeciesDto {
  @IsInt()
  species_category_id: number;

  @IsInt()
  species_level_id: number;

  @IsString()
  @MaxLength(255)
  species_name: string;

  @IsInt()
  @Min(1)
  species_max_level: number;
}

export class CreatePetDto {
  @IsInt()
  species_id: number;

  @IsString()
  @MaxLength(255)
  pet_name: string;

  @IsOptional()
  @IsString()
  pet_description?: string;

  @IsBoolean()
  @IsOptional()
  isForSale?: boolean;

  @IsNumber()
  pet_price: number;
}
