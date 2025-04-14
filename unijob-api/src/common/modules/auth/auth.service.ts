import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/database/models/user.model';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/database/models/user.model';
import { UserDto } from '../users/dto/user.dto';
import { errorHandler } from 'src/common/helpers/error-handler';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenDto } from './dto/access-token.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto): Promise<UserDto> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

            if (existingUser) {
                throw new BadRequestException('User already exists');
            }

            const hashedPassword = await bcrypt.hash(dto.password, 10);

            const user = new User();
            user.name = dto.name;
            user.email = dto.email;
            user.password = hashedPassword;
            user.role = dto.role as UserRole;

            const savedUser = await this.userRepository.save(user);
            const userDto = new UserDto();
            userDto.id = savedUser.id;
            userDto.name = savedUser.name;
            userDto.email = savedUser.email;
            userDto.role = savedUser.role;
            userDto.phone = savedUser.phone;
            userDto.location = savedUser.location;
            userDto.avatarUrl = savedUser.avatarUrl;

            return userDto;
        } catch (error) {
            this.logger.error(error);
            errorHandler(error);
            throw error;
        }
    }

    async login(dto: LoginDto): Promise<AccessTokenDto> {
        try {
            const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

            if (!existingUser) {
                throw new BadRequestException('User not found');
            }

            const isPasswordValid = await bcrypt.compare(dto.password, existingUser.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const payload = { sub: existingUser.id, email: existingUser.email, roles: [existingUser.role] };
            const accessToken = this.jwtService.sign(payload);

            return { accessToken };
        } catch (error) {
            this.logger.error(error);
            errorHandler(error);
            throw error;
        }
    }
}
