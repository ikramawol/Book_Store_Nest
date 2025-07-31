import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.services';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: AuthDto): Promise<Tokens>{
        return this.authService.signup(dto);
    }

    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: AuthDto): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@Req() req: Request){
        const user = (req as any).user;
        return this.authService.logout(user['id']);
    }

    @UseGuards(AuthGuard('jwt-refresh'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(@Req() req: Request){
        const user = (req as any).user;
        return this.authService.refreshToken(user['id'], user['refreshToken']);
    }

}