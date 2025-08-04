import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!roles){
            // no role required
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If no user (authentication failed), deny access
        if (!user) {
            throw new ForbiddenException('Authentication required');
        }

        console.log('User role:', user.role);
        if (!roles.includes(user.role)){
            throw new ForbiddenException('You do not have permission (role)');
        }
        return true;
    }
}