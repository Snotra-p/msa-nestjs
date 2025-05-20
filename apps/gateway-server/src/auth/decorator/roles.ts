import { Role } from '@libs/shared/auth/roles/role';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = Symbol('roles');

export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);
