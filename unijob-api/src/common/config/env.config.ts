import { config as configDotenv } from 'dotenv';
import { EnvConfiguration } from '../interfaces/env.interface';
import { EnvironmentEnum } from '../enums/env.enum';

configDotenv();

export const loadConfig: () => EnvConfiguration = () => ({
    environment: (process.env.NODE_ENV as EnvironmentEnum) || EnvironmentEnum.Development,
    port: parseInt(process.env.PORT!) || 21352,
    cors: { origin: process.env.CORS_ORIGIN!.split(',') },
    database: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        username: process.env.DB_USER!,
        password: process.env.DB_PASS!,
        database: process.env.DB_NAME!,
    },
    jwt: {
        secret: process.env.JWT_SECRET!,
        expires: process.env.JWT_EXPIRES_IN! || '7d',
    },
});
