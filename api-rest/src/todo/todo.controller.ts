import {Controller, Get, Post, Body, Delete, Patch, ValidationPipe, Param, ParseIntPipe} from "@nestjs/common";
import {TodoService} from "./todo.service";
import {CreateTodo} from "./dto/create-todo.dto";
import {UpdateTodo} from "./dto/update-todo.dto";
import {Todo} from "./entities/todo.entity";

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService
  ) {}

  @Post()
  create(@Body(new ValidationPipe()) data: CreateTodo): Todo {
    return this.todoService.create(data);
  }

  @Get()
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) data: UpdateTodo): Todo {
    return this.todoService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.remove(id);
  }
}
