import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loadConfig } from './common/config/env.config';
import { TypeormConfigModule } from './database/typeorm-config.module';
import { HttpLoggerModule } from './common/middlewares/http-logger.module';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthRoleGuard } from './common/guards/auth-role.guard';

@Module({
    imports: [
        AppRoutingModule,
        ConfigModule.forRoot({ isGlobal: true, load: [loadConfig] }),
        JwtModule.register({
            secret: loadConfig().jwt.secret,
            signOptions: { expiresIn: loadConfig().jwt.expires },
            global: true,
        }),
        TypeormConfigModule,
        HttpLoggerModule,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthRoleGuard,
        },
    ],
})
export class AppModule { }
