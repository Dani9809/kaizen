import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength, Min } from 'class-validator';

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
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  currency_balance: number;
}
