import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async createUser(registerDto:RegisterDto){
        const newUser = await this.prisma.user.create({ data : registerDto });
        return { message : 'Created user successfully',newUser };
    }
}
