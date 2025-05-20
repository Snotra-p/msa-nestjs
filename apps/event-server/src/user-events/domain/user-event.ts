import { AllEventContents } from '../../events/domain/event-contents';

export class UserEvent {
  id: string;
  userId: string;
  eventId: string;
  contents: AllEventContents;
  completedAt: Date;
}
