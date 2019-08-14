import { Injectable, Inject } from 'injection-js';

import { StatedBean, Stated, PostProvided } from '../../../src';
import { TodoService } from '../services/TodoService';

export interface Todo {
  id: number;
  text: string;
  state: 'todo' | 'done';
}

@StatedBean()
@Injectable()
export class TodoModel {
  @Stated()
  todoList: Todo[] = [];

  @Stated()
  current: Todo = {} as Todo;

  constructor(@Inject(TodoService) private readonly todoService: TodoService) {}

  @PostProvided()
  async fetchTodo() {
    this.todoList = (await this.todoService.fetchTodoList()) as Todo[];
  }

  addTodo = () => {
    this.todoList = [
      ...this.todoList,
      { id: this.todoList.length + 1, ...this.current },
    ];
    this.current = {} as Todo;
  };
}
