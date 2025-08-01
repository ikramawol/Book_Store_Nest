import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetCurrentUserId = createParamDecorator(
    (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user['sub'];
    },
);