import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { LoginDto } from './dto/loginUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from 'src/user/userCoookie.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService, private readonly userService: UserService,private readonly jwtService:JwtService){}

    @Post('register')
    async register(@Body() registerUserDto:RegisterDto, @Res({ passthrough : true }) res:Response){
        const tokens = await this.authService.registerUser(registerUserDto);
        res.cookie('refreshToken',tokens.refreshToken, {
            httpOnly : true,
            secure: true,
            sameSite: 'strict',
        })
        return {
            accessToken : tokens.accessToken
        }
    }

    @Post('login')
    async login(@Body() LoginDto:LoginDto,@Res({ passthrough : true }) res:Response){
        const tokens = await this.authService.loginUser(LoginDto);
        res.cookie('refreshToken',tokens.refreshToken, {
            httpOnly : true,
            secure: true,
            sameSite: 'strict',
        })
        return {
            accessToken : tokens.accessToken
        }
    }

    @Post('refresh')
    async newAccessToken(
        @Cookies('refreshToken') refreshToken: string,
        @Res({ passthrough : true }) res: Response,
    ){
        const tokens = await this.authService.reAccessToken(refreshToken);

        res.cookie('refreshToken',tokens.refreshToken, {
            httpOnly : true,
            secure: true,
            sameSite: 'strict',
        })

        return {
            accessToken : tokens.accessToken
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;
        // console.log(userId);
        const user = await this.userService.getUser(userId);
        return {
            fname : user?.fname,
            lname : user?.lname,
            email : user?.email
        };
    }

}
