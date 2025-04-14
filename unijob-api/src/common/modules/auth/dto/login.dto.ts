import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ description: 'User\'s email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User\'s password' })
    @IsString()
    password: string;
}
