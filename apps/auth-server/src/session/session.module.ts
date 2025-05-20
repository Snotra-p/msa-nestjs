import {
  // common
  Module,
} from '@nestjs/common';

import { SessionProvider } from './session.provider';
import { SessionPersistenceModule } from './infrastructure/persistence/session-persistence.module';

@Module({
  imports: [SessionPersistenceModule],
  providers: [SessionProvider],
  exports: [SessionPersistenceModule, SessionProvider],
})
export class SessionModule {}
