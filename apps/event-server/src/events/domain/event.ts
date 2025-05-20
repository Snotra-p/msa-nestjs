import { AllEventContents } from './event-contents';

export class Event {
  id: string;
  activate: boolean;
  userId: string;
  startedAt: Date;
  endedAt: Date;
  description: string;
  contents: AllEventContents[];
  requireApproval: boolean;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
