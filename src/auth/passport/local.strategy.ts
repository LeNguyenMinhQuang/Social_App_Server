import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'userName',
            passwordField: 'password',
        });
    }

    async validate(userName: string, password: string): Promise<any> {
        const user = await this.authService.validateUserForLocalStrategy(userName, password);
        if (!user) {
            throw new UnauthorizedException('Incorrect Username or Password');
        }
        return user;
    }
}
