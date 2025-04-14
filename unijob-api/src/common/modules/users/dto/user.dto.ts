import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ description: 'User ID' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'User\'s full name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'User\'s email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User\'s role', enum: ['admin', 'worker', 'employer'] })
    @IsString()
    role: string;

    @ApiProperty({ description: 'User\'s phone number', required: false })
    @IsString()
    phone?: string;

    @ApiProperty({ description: 'User\'s location', required: false })
    @IsString()
    location?: string;

    @ApiProperty({ description: 'URL to user\'s avatar image', required: false })
    @IsString()
    avatarUrl?: string;
}
