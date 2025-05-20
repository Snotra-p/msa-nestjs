import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { EventGatewayEventController } from './event/event-gateway-event.controller';
import { EventGatewayEventService } from './event/event-gateway-event.service';
import { EventGatewayRewardsController } from './rewards/event-gateway-rewards.controller';
import { EventGatewayRewardsService } from './rewards/event-gateway-rewards.service';
import { EventGatewayUserEventsController } from './user-events/event-gateway-user-events.controller';
import { EventGatewayUserEventsService } from './user-events/event-gateway-user-events.service';
import { EventGatewayUserRewardsClaimsController } from './user-rewards-claims/event-gateway-user-rewards-claims.controller';
import { EventGatewayUserRewardsClaimsService } from './user-rewards-claims/event-gateway-user-rewards-claims.service';
import { EventHttpProvider } from '../http/event/event-http.provider';

@Module({
  imports: [HttpModule],
  controllers: [
    EventGatewayEventController,
    EventGatewayRewardsController,
    EventGatewayUserEventsController,
    EventGatewayUserRewardsClaimsController,
  ],
  providers: [
    EventGatewayEventService,
    EventGatewayRewardsService,
    EventGatewayUserEventsService,
    EventGatewayUserRewardsClaimsService,
    EventHttpProvider,
  ],
})
export class EventGatewayModule {}
