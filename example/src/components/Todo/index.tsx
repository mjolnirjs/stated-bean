import React from 'react';

import { Todo } from '../../services/TodoService';

import { TodoModel } from './model';

import { useBean, useObserveEffect } from 'stated-bean';

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
  const todo = useBean(TodoModel);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { loading, error } = useObserveEffect(todo, todo.fetchTodo);

  console.log(loading, error, todo.todoList);
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
