import { Controller, Post, Body, Get, HttpStatus } from '@nestjs/common';
import { CreateRewardsInDto } from '@libs/shared/event-server/rewards/dto/create-rewards-in.dto';
import { ApiResponseDocs } from '@libs/core/decorator/api-response-docs.decorator';
import { RewardsDto } from '@libs/shared/event-server/rewards/dto/rewards.dto';
import { ResponseEntity } from '@libs/core/dto/response-entity';

import { RewardsService } from './rewards.service';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @ApiResponseDocs({
    type: RewardsDto,
  })
  @Post()
  async create(@Body() dto: CreateRewardsInDto) {
    return ResponseEntity.code(HttpStatus.CREATED).body(
      RewardsDto.fromEntity(await this.rewardsService.create(dto)),
    );
  }

  @ApiResponseDocs({
    type: RewardsDto,
    isArray: true,
  })
  @Get()
  async findAll() {
    return ResponseEntity.ok().body(
      RewardsDto.fromEntities(await this.rewardsService.findAll()),
    );
  }
}
