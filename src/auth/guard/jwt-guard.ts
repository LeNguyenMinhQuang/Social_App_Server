import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';
import { Request } from 'express';

export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
        const request: Request = context.switchToHttp().getRequest();
        if (err || !user) {
            if (info instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token expired');
            }
            if (info instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Token error');
            }
            throw new UnauthorizedException(err?.message || 'Please login');
        }

        const targetMethod = request.method;
        const targetEndpoint = request.route?.path as string;

        const permissions = user?.permissions ?? [];
        let isExists = permissions.find((permission) => {
            const { apiPath, method } = permission;
            const path = `/api/v1${apiPath}`;
            return (targetEndpoint == path && targetMethod == method) || permission.name === 'All';
        });
        if (targetEndpoint.startsWith('/api/v1/auth')) isExists = true;
        if (isExists) {
            return user;
        } else {
            throw new ForbiddenException('No permission for this');
        }
    }
}
