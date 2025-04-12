import { EnvironmentEnum } from '../enums/env.enum';

export interface EnvConfiguration {
    environment: EnvironmentEnum;
    port: number;
    cors: { origin: string[] };
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
}
