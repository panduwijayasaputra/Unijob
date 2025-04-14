import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/database/models/user.model';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ description: 'User\'s full name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'User\'s email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User\'s password' })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'User\'s role',
        enum: ['admin', 'worker', 'employer'],
        example: 'worker'
    })
    @IsEnum(['admin', 'worker', 'employer'])
    role: UserRole;
}