import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService{
    login(){
        return { mes: "succesfully logged in"};
    }
    signup(){
        return { mes: "succesfully signed up"};
    }
}