import { StatedBean, Stated } from '../../../src';

export interface Todo {
  id: number;
  text: string;
  state: 'todo' | 'done';
}

@StatedBean()
export class TodoController {
  @Stated()
  public todoList: Todo[] = [];

  @Stated()
  public current: Todo = {} as Todo;

  public constructor() {
    this.fetchTodo();
  }

  fetchTodo = () => {
    console.log('fetch todo');
    setTimeout(() => {
      this.todoList = [
        {
          id: 1,
          text: 'Buy a book',
          state: 'todo',
        },
      ];
    }, 1000);
  };

  addTodo = () => {
    this.todoList = [
      ...this.todoList,
      { id: this.todoList.length + 1, ...this.current },
    ];
    this.current = {} as Todo;
  };
}
