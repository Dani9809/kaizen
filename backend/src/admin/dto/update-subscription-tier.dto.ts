import { IsString, IsNumber, IsNotEmpty, MaxLength, Min, Matches } from 'class-validator';

export class UpdateSubscriptionTierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_ -]+$/, { message: 'Tier name can only contain alphanumeric characters, underscores, hyphens, and spaces' })
  subscription_tier_name: string;

  @IsNumber()
  @Min(0)
  monthly_price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  max_active_groups: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  max_custom_tasks: number;
}
