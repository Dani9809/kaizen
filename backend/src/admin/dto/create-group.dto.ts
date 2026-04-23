import { IsString, IsBoolean, IsArray, ValidateNested, IsInt, IsEnum, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GroupMemberDto {
  @IsInt()
  account_id: number;

  @IsEnum(['Owner', 'Admin', 'Member'])
  role_name: 'Owner' | 'Admin' | 'Member';
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  @Matches(/^[a-zA-Z0-9_ -]+$/, { message: 'Squad name can only contain alphanumeric characters, underscores, hyphens, and spaces' })
  name: string;

  @IsBoolean()
  isSharable: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];
}
