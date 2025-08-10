import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from 'express';
import { Injectable } from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        const rtSecret = process.env.JWT_REFRESH_SECRET;
        if (!rtSecret) {
            throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: rtSecret,
            passReqToCallback: true,
        })
    }

    validate(req: Request, payload: any){
        const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken,
        }
    }
}