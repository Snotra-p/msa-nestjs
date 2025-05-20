import { ROLE, Role } from '@libs/shared/auth/roles/role';
import { Exclude } from 'class-transformer';
import { ExcludeBaseTimeDto } from '@libs/core/dto/exclude-base-time.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto extends ExcludeBaseTimeDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    enum: Object.values(ROLE),
  })
  role: Role;
}
