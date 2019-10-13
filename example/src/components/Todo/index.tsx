import { TodoModel } from '../../models/TodoModel';
import { Todo } from '../../services/TodoService';

import { useInject, useObserveEffect } from 'stated-bean';
import React from 'react';

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
  const todo = useInject(TodoModel);
  const { loading } = useObserveEffect(todo, 'fetchTodo');

  return (
    <div>
      <h3>TODO</h3>
      {loading && 'loading'}
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
              text: e.currentTarget.value,
            };
          }}
          value={todo.current.text || ''}
        />
        <button>Add #{todo.todoList.length + 1}</button>
      </form>
    </div>
  );
};
