import { injectable, inject } from 'inversify';
import { StatedBean, Stated, PostProvided } from '../../../src';
import { TodoService } from '../services/TodoService';

export interface Todo {
  id: number;
  text: string;
  state: 'todo' | 'done';
}

@injectable()
@StatedBean()
export class TodoModel {
  @Stated()
  public todoList: Todo[] = [];

  @Stated()
  public current: Todo = {} as Todo;

  private todoService: TodoService;

  public constructor(@inject(TodoService) todoService: TodoService) {
    this.todoService = todoService;
  }

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
