import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RolesService } from 'src/roles/roles.service';
import { IUser } from 'src/datatype/datatype';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private roleService: RolesService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET')!,
        });
    }

    async validate(payload: IUser) {
        const { _id, userName, email, role } = payload;

        // @ts-ignore
        const permissions = (await this.roleService.findOne(role)).permission;
        return { _id, userName, email, role, permissions };
    }
}
