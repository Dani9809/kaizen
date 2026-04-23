import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, MaxLength, Matches, Min } from 'class-validator';

export class CreatePlayerDto {
  @IsNumber()
  @IsNotEmpty()
  type_id: number;

  @IsNumber()
  @IsNotEmpty()
  account_status_id: number;

  @IsNumber()
  @IsNotEmpty()
  subscription_tier_id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain alphanumeric characters, underscores, and hyphens' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  currency_balance: number;

  account_updated?: Date;
}
