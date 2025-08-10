import { PassportStrategy } from "@nestjs/passport"; // allow me to create custome authentication startegy
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from "@nestjs/common";


type JwtPayload = {
    sub: number;
    email: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        const atSecret = process.env.JWT_ACCESS_SECRET;
        if (!atSecret) {
            throw new Error('JWT_ACCESS_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: atSecret,
        });
    }

    validate(payload: any){
        return payload;
    }
}