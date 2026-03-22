import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create')
  create(@Body() createCourseDto: CreateCourseDto, @Req() req) {
    const userId = req.user.sub;
    return this.courseService.create(createCourseDto,userId);
  }

  @Get('get')
  findAll() {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
