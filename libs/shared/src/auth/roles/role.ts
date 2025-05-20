import { ValueOf } from '@libs/core/types/value-of.type';

export const ROLE = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR',
  AUDITOR: 'AUDITOR',
  USER: 'USER',
} as const;

export type Role = ValueOf<typeof ROLE>;
