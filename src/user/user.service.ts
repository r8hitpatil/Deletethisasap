import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService){}

    async createUser(registerDto:RegisterDto){
        return await this.prisma.user.create({ data :  registerDto  });
    }

    async getUser(id: string){
        return await this.prisma.user.findUnique({ where : { id }})
    }
}
    