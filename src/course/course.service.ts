import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {

  constructor(private readonly prisma: PrismaService){}

  async create(createCourseDto: CreateCourseDto,userId:string) {
    return await this.prisma.course.create({
      data : {
        name : createCourseDto.name,
        description: createCourseDto.description,
        price : createCourseDto.price,
        user : {
          connect : { id : userId }
        }
      }
    })
  }

  findAll() {
    return `This action returns all course`;
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
