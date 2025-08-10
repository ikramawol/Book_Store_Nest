import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom parameter decorator to get the current user
export const GetCurrentUser = createParamDecorator(
    // context is the execution context of the request
    // data is the name of the property to extract from the user object
    
    (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    if (!data) return request.user;
    return request.user[data]; // return the specific property of the user object
    },
);