import { SetMetadata, applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { METADATA_ROLES_KEY } from '../constants/role.constant';
import { JwtRoleEnum } from '../enums/jwt-role.enum';

export function AuthRole(...roles: JwtRoleEnum[]) {
    console.log(roles);
    return applyDecorators(
        SetMetadata(METADATA_ROLES_KEY, roles),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({
            description: 'Token missing, invalid, or expired',
            example: {
                message: 'Token missing, invalid, or expired',
                error: 'Unauthorized',
                statusCode: 401,
            },
        }),
        ApiForbiddenResponse({
            description: 'Access denied',
            example: {
                message: 'Access denied',
                error: 'Forbidden',
                statusCode: 403,
            },
        }),
    );
}
