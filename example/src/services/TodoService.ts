import { injectable } from 'inversify';

@injectable()
export class TodoService {
  public async fetchTodoList() {
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
