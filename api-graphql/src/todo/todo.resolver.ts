import {Args, Mutation, Resolver, Query} from '@nestjs/graphql';
import {TodoService} from './todo.service';
import {CreateTodoInput} from './dto/inputs/create-todo.input';
import {UpdateTodoInput} from './dto/inputs/update-todo.input';
import {Todo} from './entities/todo.entity';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  /*
  localhost:3000/graphql
  POST

  // Consulta
  query{
    descriptions: todos{
      description,
    },
    ids: todos{
      id_todo
    }	
  }

  // Create Register
  mutation createTodo($createTodoInput: CreateTodoInput!) {
      createTodo(createTodoInput: $createTodoInput) {
        id_todo
        description
        done
      }
    }

    {
      "createTodoInput": {
        "description": "Sacar al perro",
      }
    }

  // Consulta de Registro
  query findOne($id_todo: String!) {
      findOne(id_todo: $id_todo) {
        id_todo
        description
        done
      }
  }

  Variables:
  {
    "id_todo": "b8e09fcc-391a-4687-a1ea-26483cf4e62e"
  }

    mutation updateTodo($updateTodoInput: UpdateTodoInput!) {
      updateTodo(updateTodoInput: $updateTodoInput) {
        id_todo
        description
        done
      }
    }

    Variables:
    {
      "updateTodoInput": {
        "id_todo": "b8e09fcc-391a-4687-a1ea-26483cf4e62e",
        "done": true
      }
    }


    mutation removeTodo($id_todo: String!) {
      removeTodo(id_todo: $id_todo) {
        description
      }
    }

    Variables:
    {
      "id_todo": "b8e09fcc-391a-4687-a1ea-26483cf4e62e"
    }
  */

  @Mutation(() => Todo)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput
  ): Promise<Todo> {
    return await this.todoService.create(createTodoInput);
  }

  @Query(() => [Todo], {name: "todos"})
  async findAll(): Promise<Todo[]> {
    return await this.todoService.findAll();
  }

  @Query(() => Todo)
  async findOne(
    @Args('id_todo') id_todo: string
  ): Promise<Todo> {
    return await this.todoService.findOne(id_todo);
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput
  ): Promise<Todo> {
    return await this.todoService.update(updateTodoInput.id_todo, updateTodoInput);
  }

  @Mutation(() => Todo)
  async removeTodo(
    @Args('id_todo') id_todo: string
  ): Promise<Todo> {
    return await this.todoService.remove(id_todo);
  }
}
