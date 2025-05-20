import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { ROLE, Role } from '@libs/shared/auth/roles/role';

export class CreateUserInDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  // @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    enum: Object.values(ROLE),
  })
  @IsEnum(ROLE)
  @IsNotEmpty()
  role!: Role;
}
