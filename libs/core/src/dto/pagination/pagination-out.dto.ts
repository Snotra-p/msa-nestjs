import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutDto {
  @ApiProperty() private readonly totalElements: number;
  @ApiProperty() private readonly totalPages: number;
  @ApiProperty() private readonly page: number;
  @ApiProperty() private readonly size: number;

  constructor(pagination: {
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
  }) {
    this.totalElements = pagination.totalElements;
    this.totalPages = pagination.totalPages;
    this.page = pagination.page;
    this.size = pagination.size;
  }
}
