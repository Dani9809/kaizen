import { IsString, IsNumber, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreateQuestTypeDto {
  @IsString()
  @MaxLength(255)
  quest_type_name: string;

  @IsOptional()
  @IsString()
  quest_type_description?: string;
}

export class CreateQuestDto {
  @IsOptional()
  @IsInt()
  quest_type_id?: number;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  reward_amount: number;
}
