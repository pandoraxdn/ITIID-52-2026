import {Module} from '@nestjs/common';
import {TodoService} from './todo.service';
import {TodoResolver} from './todo.resolver';
import {Todo} from './entities/todo.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
