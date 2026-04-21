import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsOptional, IsString} from "class-validator";

export class RegisterDto {
    @IsString()
    fname! : string;

    @IsString()
    lname! : string;

    @IsEmail()
    email! : string;

    @IsString()
    password! : string;
    
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}