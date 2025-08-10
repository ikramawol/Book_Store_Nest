// nestJs Utilities for creating custome decorator
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// custom parameter decorator to get the current user ID
export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext): number => {

    const request = context.switchToHttp().getRequest();//gets the current HTTP request
    return request.user['sub']; // userId: number
  },
);

// custom parameter decorator to get the current user refresh token
export const GetCurrentRefreshToken = createParamDecorator(
  (data: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user['refreshToken'];
  },
);