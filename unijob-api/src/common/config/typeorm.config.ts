import { DataSource, DataSourceOptions } from 'typeorm';
import { loadConfig } from './env.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SeederOptions } from 'typeorm-extension';

const config = loadConfig();
export const configTypeOrm: DataSourceOptions = {
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    migrations: [__dirname + '/../../database/migrations/*{.ts,.js}'],
    entities: [__dirname + '/../../database/models/*{.ts,.js}'],
    migrationsTableName: 'migrations_table',
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: true,
    // SSL for production only
    ...(config.environment === 'production' ? { ssl: { rejectUnauthorized: false } } : false),
    poolSize: 50,
};

export const dataSource = new DataSource({
    ...configTypeOrm,
    seeds: [__dirname + '/../../database/seeds/*.seeder{.ts,.js}'],
    factories: [__dirname + '/../../database/factories/*.factory*{.ts,.js}'],
} as DataSourceOptions & SeederOptions);
