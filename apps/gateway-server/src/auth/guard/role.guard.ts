import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLE } from '@libs/shared/auth/roles/role';

import { ROLES_KEY } from '../decorator/roles';
import { JwtPayloadType } from '../strategies/types/jwt-payload.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: JwtPayloadType }>();
    const user = request.user;

    if (user.role === ROLE.ADMIN) {
      return true;
    }

    return roles.includes(user.role);
  }
}
