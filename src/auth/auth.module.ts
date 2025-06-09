import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';
import { HashPassword } from 'src/utils/hash.password';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from 'src/utils/token.service';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { RolesModule } from 'src/roles/roles.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                signOptions: {
                    expiresIn: ms(config.get<string>('JWT_ACCESS_EXPIRE') as ms.StringValue) / 1000,
                },
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        RolesModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, HashPassword, TokenService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
