import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import type { Response } from 'express';
import { GetUser } from './decorators';
import type { JwtPayloadWithRt, JwtUser } from './types';
import { setAccessToken, setRefreshToken } from './utils/cookie.utils';
import { AtGuard, RtGuard } from './guards';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() registerUserDto:RegisterDto, @Res({ passthrough : true }) res:Response){
        const tokens = await this.authService.registerUser(registerUserDto);
        
        setRefreshToken(res,tokens.rToken);
        setAccessToken(res,tokens.aToken);

        return {
            message : "User Registered successfully"
        }
    }

    @Post('login')
    async login(@Body() LoginDto:LoginDto,@Res({ passthrough : true }) res:Response){
        const tokens = await this.authService.loginUser(LoginDto);
        
        setRefreshToken(res,tokens.rToken);
        setAccessToken(res,tokens.aToken);

        return {
            message : "User logged in successfully"
        }
    }

    @UseGuards(RtGuard)
    @Post('refresh')
    async newAccessToken(
        @GetUser() user: JwtPayloadWithRt,
        @Res({ passthrough : true }) res: Response,
    ){
        const tokens = await this.authService.reAccessToken(user.refreshToken);
        setRefreshToken(res,tokens.rToken);
        setAccessToken(res,tokens.aToken);

        return {
            message : "Tokens refreshed successfully"
        }
    }

    @UseGuards(AtGuard)
    @Get('profile')
    // why we imported JwtUser as type is we need it as a type during runtime before it was crashing like interface JwtUser {}
    async getProfile(@GetUser() user:JwtUser) {
        return user;
    }
}