import { Injectable, Inject } from 'injection-js';

import { TodoService, Todo } from '../services/TodoService';

import { StatedBean, Stated, PostProvided } from 'stated-bean';

@StatedBean()
@Injectable()
export class TodoModel {
  @Stated()
  todoList: Todo[] = [];

  @Stated()
  current: Todo = {};

  constructor(@Inject(TodoService) private readonly todoService: TodoService) {}

  @PostProvided()
  async fetchTodo() {
    this.todoList = await this.todoService.fetchTodoList();
  }

  addTodo = () => {
    this.todoList = [
      ...this.todoList,
      {
        id: this.todoList.length + 1,
        ...this.current,
      },
    ];
    this.current = {};
  };
}
