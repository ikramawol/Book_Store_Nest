import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUser = createParamDecorator(
    (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    if (!data) return request.user;
    return request.user[data];
    },
);