import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadConfig } from './common/config/env.config';
import { TypeormConfigModule } from './common/database/typeorm-config.module';
import { HttpLoggerModule } from './common/middlewares/http-logger.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
        TypeormConfigModule,
        HttpLoggerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
