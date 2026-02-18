import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateTodo} from "./dto/create-todo.dto";
import {UpdateTodo} from "./dto/update-todo.dto";
import {Todo} from "./entities/todo.entity";

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    {id: 1, description: "Piedra del alma", done: false},
    {id: 2, description: "Piedra del tiempo", done: false},
    {id: 3, description: "Piedra del espacio", done: true},
  ];

  create(data: CreateTodo): Todo {
    const todo = new Todo();
    todo.id = Math.max(...this.todos.map(todo => todo.id), 0) + 1;
    todo.description = data.description;
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((todo) => todo.id === id);
    return todo || (() => {throw new NotFoundException("Todo no encontrado")})();
  }

  update(id: number, data: UpdateTodo): Todo {
    const {description, done} = data;
    const todo = this.findOne(id);
    if (done !== undefined) {
      todo.done = done;
    }
    if (description !== undefined) {
      todo.description = description;
    }
    this.todos = this.todos.map((todoDb) => {
      (todoDb.id === id) && (() => {
        return todo;
      })();
      return todoDb;
    });
    return todo;
  }

  remove(id: number): Todo {
    const todo = this.findOne(id);
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
    return todo;
  }
}
