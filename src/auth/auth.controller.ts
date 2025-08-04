import { Controller, Post, Body, HttpStatus, HttpCode, UseGuards, Req, } from '@nestjs/common';
import { AuthService } from './auth.services';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { Tokens } from './types';
import { AtGuard } from './common/guards/at.guard';
import { GetCurrentUserId, GetCurrentRefreshToken } from './common/decorators/get-current-user-id.decorator';
import { RtGuard } from './common/guards/rt.guard';
import { Public } from './common/decorators/public.decorator';

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @Public()
    @Post('local/signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() dto: SignupDto): Promise<Tokens>{
        return this.authService.signup(dto);
    }

    @Public()
    @Post('local/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto): Promise<Tokens> {
        return this.authService.login(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId:number){
        return this.authService.logout(userId);
    }

    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshToken(@GetCurrentUserId() userId: number, @GetCurrentRefreshToken() refreshToken: string){
        return this.authService.refreshToken(userId, refreshToken);
    }

}