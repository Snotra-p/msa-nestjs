import { ApiProperty } from '@nestjs/swagger';

export class ErrorOutDto {
  @ApiProperty() readonly errorCode?: number;
  @ApiProperty() readonly message?: string;
  @ApiProperty() readonly errorDetail?: unknown;

  constructor(errorCode: number, message: string, error?: unknown) {
    this.errorCode = errorCode;
    this.message = message;
    this.errorDetail = error;
  }
}
