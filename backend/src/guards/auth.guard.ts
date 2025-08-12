// auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';
import { ROLES_KEY } from './roles.decorator';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const username = req.headers['token'] as string | undefined; // TODO: replace with real JWT

    if (!username) throw new UnauthorizedException('Token header is missing');

    const user = await this.usersService.findByUsername(username);
    if (!user) throw new UnauthorizedException('User not found');

    if (user.status === 'Deleted') {
      throw new UnauthorizedException('Account deleted');
    }
    if (user.status === 'Disabled') {
      throw new ForbiddenException('Account disabled');
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (requiredRoles?.length) {
      const has = user.roles?.some((r: string) => requiredRoles.includes(r));
      if (!has) throw new ForbiddenException('Insufficient role');
    }

    req.user = user;
    return true;
  }
}
