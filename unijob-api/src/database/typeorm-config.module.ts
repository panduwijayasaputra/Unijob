import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadConfig } from '../common/config/env.config';
import { configTypeOrm } from '../common/config/typeorm.config';
import { User } from './models/user.model';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async () => {
                const logger = new Logger(TypeOrmModule.name);

                try {
                    logger.log('Successfully to load TypeORM configuration');
                    logger.log(
                        `Successfully connected to Database: ${loadConfig().database.database}`,
                    );
                    return configTypeOrm;
                } catch (error) {
                    logger.log('Error connecting to database', error);
                    process.exit(1);
                }
            },
        }),

        // Load Entitys
        TypeOrmModule.forFeature([
            User
        ]),
    ],
    exports: [TypeOrmModule],
})
export class TypeormConfigModule { }
