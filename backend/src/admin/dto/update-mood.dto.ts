import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateMoodDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  mood_label: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  mood_description: string;
}
