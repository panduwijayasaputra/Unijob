import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtRoleEnum } from '../enums/jwt-role.enum';
import { METADATA_ROLES_KEY } from '../constants/role.constant';
import { errorHandler } from '../helpers/error-handler';
import { METADATA_PUBLIC_ROLE_KEY } from '../constants/public-role.contant';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private reflector: Reflector,
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndMerge<JwtRoleEnum[]>(
            METADATA_ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        const isPublicRole = this.reflector.getAllAndOverride<boolean>(
            METADATA_PUBLIC_ROLE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles && !isPublicRole) {
            this.logger.warn('Guard: @AuthRole or @Public missing');
            throw new InternalServerErrorException(
                'Undefined endpoint role. Please supply @AuthRole or @Public decorator.',
            );
        }
        if (isPublicRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        try {
            const payload = this.jwtService.verify<JwtPayload>(token);
            const roles = payload.role;

            if (!this.canAccess(roles, requiredRoles)) {
                throw new ForbiddenException('Access denied');
            }

            request.jwt = payload;
            return true;
        } catch (error) {
            errorHandler(error);
            return false;
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private canAccess(role: JwtRoleEnum, requiredRoles: JwtRoleEnum[]) {
        return requiredRoles.includes(role);
    }
}
