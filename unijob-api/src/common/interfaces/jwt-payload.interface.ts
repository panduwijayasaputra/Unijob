import { JwtRoleEnum } from '../enums/jwt-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: JwtRoleEnum;
}
