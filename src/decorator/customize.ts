import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// Public()
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// User()
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
// Message()
export const MESSAGE = 'message';
export const Message = (message: string) => SetMetadata(MESSAGE, message);
