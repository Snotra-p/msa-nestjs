import { Role } from '@libs/shared/auth/roles/role';

export type JwtPayloadType = {
  id: string;
  sessionId: string;
  iat: number;
  exp: number;
  role: Role;
};
