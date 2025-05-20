import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ErrorOutDto } from './error-out.dto';
import { PaginationOutDto } from './pagination/pagination-out.dto';

class ResponseEntityBuilder<T> {
  private _code: HttpStatus;
  private _data?: T;
  private _pagination?: PaginationOutDto;

  constructor(code: HttpStatus) {
    this._code = code;
  }

  body<T>(body: T): ResponseEntity<T> {
    return new ResponseEntity<T>({ code: this._code, data: body });
  }

  build(): ResponseEntity<void> {
    return new ResponseEntity<void>({
      code: this._code,
    });
  }
}

export class ResponseEntity<T> {
  @ApiProperty() readonly code: HttpStatus;
  @ApiProperty() readonly success: boolean;
  @ApiPropertyOptional() readonly data?: T;
  @ApiPropertyOptional() readonly error?: ErrorOutDto;
  @ApiPropertyOptional() pagination?: PaginationOutDto;

  constructor(options: {
    code?: HttpStatus;
    data?: T;
    error?: ErrorOutDto;
    pagination?: PaginationOutDto;
  }) {
    this.code = options.code || HttpStatus.OK;
    this.success = !options.error && this.code < HttpStatus.CONTENT_DIFFERENT;
    this.data = options.data;
    this.error = options.error;
    this.pagination = options.pagination;
  }

  static ok<T>(): ResponseEntityBuilder<T> {
    return new ResponseEntityBuilder<T>(HttpStatus.OK);
  }

  static code<T>(code: HttpStatus): ResponseEntityBuilder<T> {
    return new ResponseEntityBuilder<T>(code);
  }

  static error(
    errorCode: number,
    message: string,
    httpStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: unknown,
  ): ResponseEntity<undefined> {
    return new ResponseEntity<undefined>({
      code: httpStatus,
      error: new ErrorOutDto(errorCode, message, error),
    });
  }

  setPagination(paginationDto: PaginationOutDto): ResponseEntity<T> {
    this.pagination = paginationDto;
    return this;
  }
}
