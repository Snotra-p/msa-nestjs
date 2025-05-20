import { Role } from '@libs/shared/auth/roles/role';
import { Exclude } from 'class-transformer';

export class User {
  id: string;

  email: string;

  password: string;

  role: Role;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
