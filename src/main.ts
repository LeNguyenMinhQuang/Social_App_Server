import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { join } from 'path';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/guard/jwt-guard';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);
    const reflector = app.get(Reflector);

    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(helmet());
    app.use(cookieParser());
    app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new TransformInterceptor(reflector));

    app.enableCors({
        origin: 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
    });

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: ['1'],
    });

    await app.listen(config.get<string>('PORT') ?? 3000);
}
bootstrap();
