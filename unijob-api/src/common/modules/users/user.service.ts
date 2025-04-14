import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/models/user.model';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { errorHandler } from 'src/common/helpers/error-handler';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll(): Promise<UserDto[]> {
        try {
            const users = await this.userRepository.find();

            if (!users) {
                throw new NotFoundException('No users found');
            }

            return users.map((user: User) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                avatarUrl: user.avatarUrl
            }));
        } catch (error) {
            this.logger.error(error);
            errorHandler(error);
            throw error;
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            this.logger.error(error);
            errorHandler(error);
            throw error;
        }
    }



}
