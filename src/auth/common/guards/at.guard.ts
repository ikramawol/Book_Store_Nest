import { AuthGuard } from "@nestjs/passport"; // Passport authentication guard (AuthGuard('jwt'))
import { Reflector } from "@nestjs/core"; // utility to read metadata set by decorators
import { ExecutionContext} from "@nestjs/common"; // context of the current req
import { Observable } from "rxjs"; // used for acync operations (canActivate)
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