import { RegisterUserDto } from './../users/dto/create-user.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { IUser } from 'src/datatype/datatype';
import { UsersService } from 'src/users/users.service';
import { HashPassword } from 'src/utils/hash.password';
import { TokenService } from 'src/utils/token.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private hassPassword: HashPassword,
        private tokenService: TokenService,
    ) {}

    // For client

    async register(registreUserDto: RegisterUserDto) {
        return this.usersService.register(registreUserDto);
    }

    async login(user: IUser, res: Response) {
        const { _id, userName, email, role } = user;
        const payload = {
            sub: 'token login',
            iss: 'from server',
            _id,
            userName,
            email,
            role,
        };
        const refresh_token = this.tokenService.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);
        this.tokenService.saveTokenAtClientCookie(res, refresh_token);
        const access_token = this.tokenService.createAccessToken(payload);
        const objUser = await this.usersService.findOne(_id);
        return {
            access_token,
            user: objUser,
        };
    }

    async logout(user: IUser, res: Response) {
        const { _id } = user;
        await this.usersService.updateUserToken(null, _id);
        res.clearCookie('refresh_token');
        return {
            message: 'Logged Out',
        };
    }

    async refreshNewTokenWhenAccessTokenExpired(refresh_token: string, res: Response) {
        try {
            this.tokenService.verifyRefreshToken(refresh_token);
            let user = await this.usersService.findUserByRefreshToken(refresh_token);
            if (!user) {
                throw new BadRequestException('Refresh Token Invalid');
            }
            const { _id, userName, email, role } = user;
            const payload = {
                sub: 'token login',
                iss: 'from server',
                _id,
                userName,
                email,
                role,
            };

            const new_refresh_token = this.tokenService.createRefreshToken(payload);
            await this.usersService.updateUserToken(new_refresh_token, _id.toString());
            res.clearCookie('refresh_token');
            this.tokenService.saveTokenAtClientCookie(res, new_refresh_token);
            const access_token = this.tokenService.createAccessToken(payload);

            return {
                access_token,
                user: {
                    _id,
                    userName,
                    email,
                    role,
                },
            };
        } catch (error) {
            throw new BadRequestException('Refresh Token Invalid');
        }
    }

    async checkAccessToken(user: IUser) {
        const { _id } = user;
        const res = await this.usersService.findOne(_id);
        if (res) {
            return {
                data: res?.data,
            };
        } else {
            throw new UnauthorizedException('Token Invalid');
        }
    }

    // For server

    async validateUserForLocalStrategy(userName: string, password: string) {
        const user = await this.usersService.findOneByUserNameForValidate(userName);
        if (user && this.hassPassword.handleComparePassword(password, user.password)) {
            return user;
        }
        return null;
    }
}
