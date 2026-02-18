import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTodoInput} from './dto/inputs/create-todo.input';
import {UpdateTodoInput} from './dto/inputs/update-todo.input';
import {Todo} from './entities/todo.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    const register = this.todoRepository.create(createTodoInput);
    return await this.todoRepository.save(register);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async findOne(id_todo: string): Promise<Todo> {
    const register = await this.todoRepository.findOneBy({id_todo});
    return (
      register || (() => {
        throw new NotFoundException(`Todo with id_todo: ${id_todo} not found`)
      })()
    );
  }

  async update(id_todo: string, updateTodoInput: UpdateTodoInput) {
    const register = await this.todoRepository.preload(updateTodoInput);
    if (!register) {
      throw new NotFoundException(`Todo with id_todo: ${id_todo} not found`)
    }
    return this.todoRepository.save(register)
  }

  async remove(id_todo: string) {
    const register = await this.findOne(id_todo);
    return await this.todoRepository.remove(register);
  }
}
