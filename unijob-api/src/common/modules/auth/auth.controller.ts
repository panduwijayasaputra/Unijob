import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { camelCaseToWords } from 'src/helpers/transform-camel-case';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserDto } from '../users/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@ApiTags(camelCaseToWords(AuthController.name))
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @HttpCode(200)
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 200, description: 'User successfully registered', type: UserDto })
    @ApiResponse({ status: 400, description: 'Bad request - User already exists' })
    async register(@Body() dto: RegisterDto): Promise<UserDto> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in', type: AccessTokenDto })
    @ApiResponse({ status: 400, description: 'Bad request - User not found or invalid credentials' })
    async login(@Body() dto: LoginDto): Promise<AccessTokenDto> {
        return this.authService.login(dto);
    }
}
