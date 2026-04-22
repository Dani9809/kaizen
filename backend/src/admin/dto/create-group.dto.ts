import { IsString, IsBoolean, IsArray, ValidateNested, IsInt, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class GroupMemberDto {
  @IsInt()
  account_id: number;

  @IsEnum(['Owner', 'Admin', 'Member'])
  role_name: 'Owner' | 'Admin' | 'Member';
}

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsBoolean()
  isSharable: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GroupMemberDto)
  members: GroupMemberDto[];
}
