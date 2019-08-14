import * as React from 'react';
import { useStatedBean } from '../../../../src';
import { TodoModel, Todo } from '../../models/TodoModel';

function TodoList(props: { items: Todo[] }) {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

export const TodoApp = () => {
  const todo = useStatedBean(TodoModel);

  console.log('todo.current', todo.current);
  return (
    <div>
      <h3>TODO</h3>
      <TodoList items={todo.todoList} />
      <form
        onSubmit={e => {
          e.preventDefault();
          todo.addTodo();
        }}
      >
        <label htmlFor="new-todo">What needs to be done?</label>
        <input
          id="new-todo"
          onChange={e => {
            todo.current = {
              ...todo.current,
              text: e.target.value,
            };
          }}
          value={todo.current.text || ''}
        />
        <button>Add #{todo.todoList.length + 1}</button>
      </form>
    </div>
  );
};
