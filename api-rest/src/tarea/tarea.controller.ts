import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ValidationPipe} from '@nestjs/common';
import {TareaService} from './tarea.service';
import {CreateTareaDto} from './dto/create-tarea.dto';
import {UpdateTareaDto} from './dto/update-tarea.dto';

@Controller('tarea')
export class TareaController {
  constructor(private readonly tareaService: TareaService) {}

  @Post()
  create(@Body(new ValidationPipe) data: CreateTareaDto) {
    return this.tareaService.create(data);
  }

  @Get()
  findAll() {
    return this.tareaService.findAll();
  }

  @Get(':id_tarea')
  findOne(@Param('id_tarea', ParseIntPipe) id_tarea: number) {
    return this.tareaService.findOne(id_tarea);
  }

  @Patch(':id_tarea')
  update(@Param('id_tarea', ParseIntPipe) id_tarea: number, @Body(new ValidationPipe()) data: UpdateTareaDto) {
    return this.tareaService.update(id_tarea, data);
  }

  @Delete(':id_tarea')
  remove(@Param('id_tarea', ParseIntPipe) id_tarea: number) {
    return this.tareaService.remove(id_tarea);
  }
}
