import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { METADATA_ROLES_KEY } from '../constants/role.constant';
import { JwtRoleEnum } from '../enums/jwt-role.enum';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<JwtRoleEnum[]>(METADATA_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token missing, invalid, or expired');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Token missing, invalid, or expired');
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;

      // Handle both single role and array of roles
      const userRoles = payload.roles || [payload.role];

      // Check if user has the required role
      const hasRole = requiredRoles.some((role) =>
        Array.isArray(userRoles)
          ? userRoles.includes(role)
          : userRoles === role
      );

      if (!hasRole) {
        return false;
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token missing, invalid, or expired');
    }
  }
}