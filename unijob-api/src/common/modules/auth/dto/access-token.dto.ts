import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
    @ApiProperty({ description: 'Access token' })
    accessToken: string;
}