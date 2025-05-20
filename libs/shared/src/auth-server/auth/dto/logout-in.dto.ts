import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LogoutInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}
