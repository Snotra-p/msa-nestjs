import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { PointRewardContent } from 'apps/event-server/src/rewards/domain/reward-content';
import { REWARD_TYPE } from '@libs/shared/event-server/rewards/reward-type';

import databaseConfig from '../../../../apps/event-server/src/database/database.config';
import { MongooseConfigService } from '../../../../apps/event-server/src/database/mongoose-config.service';
import { RewardsPersistenceModule } from '../../../../apps/event-server/src/rewards/infrastructure/persistence/rewards-persistence.module';
import { RewardsRepository } from '../../../../apps/event-server/src/rewards/infrastructure/persistence/rewards.repository';

describe('RewardsRepository', () => {
  let repository: RewardsRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig],
          cache: true,
          envFilePath: `./apps/event-server/.${process.env.NODE_ENV ?? 'test'}.event.env`,
        }),
        MongooseModule.forRootAsync({
          useClass: MongooseConfigService,
        }),
        RewardsPersistenceModule,
      ],
      providers: [],
      exports: [RewardsPersistenceModule],
    }).compile();

    repository = module.get<RewardsRepository>(RewardsRepository);
  });

  afterEach(async () => {
    const model = repository.getModel();
    await model.deleteMany();
    await module.close();
  });

  it('create wrong schema test - discriminator schema restrict test', async () => {
    await expect(
      repository.create({
        eventId: '664aeb5e2ef4e06be6f2b238',
        userId: '664aeb5e2ef4e06be6f2b238',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        contents: [
          { type: REWARD_TYPE.POINT, quantity: 100, poooooint: 100 } as any,
        ],
      }),
    ).rejects.toThrow();

    const result = await repository.create({
      eventId: '664aeb5e2ef4e06be6f2b238',
      userId: '664aeb5e2ef4e06be6f2b238',
      contents: [{ type: REWARD_TYPE.POINT, quantity: 100, point: 100 }],
    });

    const contents = result.contents[0] as PointRewardContent;

    expect(contents.type).toBe(REWARD_TYPE.POINT);
    expect(contents.point).toBe(100);
    expect(contents.quantity).toBe(100);
  });
});
