import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    Res,
    UseGuards,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Message, Public, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Message('Register')
    @Public()
    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Message('Login')
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@User() user, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(user, res);
    }

    @Public()
    @Message('Access token expired, refresh new one')
    @Get('refresh')
    handleRefreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refresh_token = req.cookies && req.cookies['refresh_token'] ? req.cookies['refresh_token'] : null;
        if (!refresh_token) {
            console.log('Refresh token is not provided');
            throw new UnauthorizedException('Refresh token is not provided');
        }
        return this.authService.refreshNewTokenWhenAccessTokenExpired(refresh_token, res);
    }

    @Message('Logout')
    @Get('logout')
    logout(@User() user, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(user, res);
    }

    @Message('Check access token')
    @Get()
    handleCheckAccessToken(@User() user) {
        return this.authService.checkAccessToken(user);
    }

    @Message('Error')
    @Get('error')
    handleError() {
        throw new UnauthorizedException('You are not authorized to access this resource');
    }
}
