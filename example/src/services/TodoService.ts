import { Injectable } from 'injection-js';

@Injectable()
export class TodoService {
  async fetchTodoList() {
    return new Promise(resolve => {
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
