import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { camelCaseToWords } from 'src/helpers/transform-camel-case';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { AuthRole } from 'src/common/decorators/auth-role.decorator';
import { JwtRoleEnum } from 'src/common/enums/jwt-role.enum';
@ApiTags(camelCaseToWords(UserController.name))
@Controller()
export class UserController {

    constructor(private readonly usersService: UserService) { }

    @Get('/')
    @HttpCode(200)
    @AuthRole(JwtRoleEnum.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'All users retrieved successfully', type: UserDto })
    @ApiResponse({ status: 404, description: 'No users found' })
    async getAllUsers(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }

    @Get('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiResponse({ status: 200, description: 'User retrieved successfully', type: UserDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.findOne(id);
    }
}
