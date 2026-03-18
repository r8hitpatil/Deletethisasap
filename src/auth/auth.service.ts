import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dto/registerUser.dto';
import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private readonly userService:UserService){}

    async registerUser(registerDto: RegisterDto){
        const hash = await argon.hash(registerDto.password);
        return this.userService.createUser({ ...registerDto,password:hash });
    }
}
