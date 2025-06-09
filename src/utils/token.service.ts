import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class TokenService {
    constructor(
        private config: ConfigService,
        private jwtService: JwtService,
    ) {}

    createAccessToken(payload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: ms(this.config.get<string>('JWT_ACCESS_EXPIRE') as ms.StringValue) / 1000,
        });

        return accessToken;
    }

    createRefreshToken(payload) {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.config.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue) / 1000,
        });

        return refreshToken;
    }

    saveTokenAtClientCookie(res: Response, refresh_token) {
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.config.get<string>('JWT_REFRESH_EXPIRE') as ms.StringValue),
        });
    }

    verifyRefreshToken(refresh_token) {
        this.jwtService.verify(refresh_token, {
            secret: this.config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        });
    }
}
