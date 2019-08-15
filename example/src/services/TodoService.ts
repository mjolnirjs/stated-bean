import { Injectable } from 'injection-js';

export type Todo = Partial<{
  id: number;
  text: string;
  state: 'todo' | 'done';
}>;

@Injectable()
export class TodoService {
  async fetchTodoList() {
    return new Promise<Todo[]>(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            text: 'Buy a book',
            state: 'todo',
          },
        ]);
      }, 500);
    });
  }
}
