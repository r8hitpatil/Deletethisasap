import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateCourseDto {
    @IsString()
    name!: string;

    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price!: number;
}
