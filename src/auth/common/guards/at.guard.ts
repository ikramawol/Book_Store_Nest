import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

@Injectable()
export class AtGuard extends AuthGuard('jwt'){
    constructor(private reflector: Reflector) {
        super();
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        
        // If not public, proceed with the JWT authentication
        return super.canActivate(context);
    }
}