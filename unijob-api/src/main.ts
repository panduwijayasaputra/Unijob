import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './common/config/swagger.config';
import { loadConfig } from './common/config/env.config';
import { EnvironmentEnum } from './common/enums/env.enum';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { HttpLoggerMiddleware } from './common/middlewares/http-logger.middleware';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
        logger:
            process.env.NODE_ENV === EnvironmentEnum.Development
                ? ['log', 'error', 'warn', 'debug', 'verbose']
                : ['log', 'error', 'warn'],
    });

    const config = loadConfig();
    const fastifyInstance = app.getHttpAdapter().getInstance();
    const httpLoggerMiddleware = app.get(HttpLoggerMiddleware);

    // Global prefix for all routes
    app.setGlobalPrefix('/api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    // CORS configuration
    app.enableCors({
        origin: config.cors.origin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
    });

    // Middleware hooks for logging
    fastifyInstance.addHook('onRequest', httpLoggerMiddleware.onRequest.bind(httpLoggerMiddleware));
    fastifyInstance.addHook(
        'preHandler',
        httpLoggerMiddleware.preHandler.bind(httpLoggerMiddleware),
    );
    fastifyInstance.addHook('onSend', httpLoggerMiddleware.onSend.bind(httpLoggerMiddleware));

    if (config.environment === EnvironmentEnum.Development) {
        setupSwagger(app);
    }

    app.enableShutdownHooks();
    await app.listen(config.port);
}
bootstrap();
