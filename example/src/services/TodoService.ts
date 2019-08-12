import { injectable } from 'inversify';

@injectable()
export class TodoService {
  public async fetchTodoList() {
    return [
      {
        id: 1,
        text: 'Buy a book',
        state: 'todo',
      },
    ];
  }
}
