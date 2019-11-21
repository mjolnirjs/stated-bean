import * as React from 'react';

import './App.less';

export const App = () => {
  return (
    <div className="app">
      <div className="header">
        <div className="title">Stated Bean</div>
        <p>
          A light but scalable <b>view-model</b> library with react hooks.
        </p>
      </div>
      <div className="badges">
        <a href="https://codecov.io/gh/mjolnirjs/stated-bean" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/codecov/c/gh/mjolnirjs/stated-bean" />
        </a>
        <a href="https://github.com/plantain-00/type-coverage" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/dynamic/json.svg?label=type-coverage&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fmjolnirjs%2Fstated-bean%2Fmaster%2Fpackage.json" />
        </a>
        <a href="https://www.npmjs.com/package/stated-bean" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/npm/v/stated-bean.svg" />
        </a>
        <a href="https://github.com/mjolnirjs/stated-bean" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/bundlephobia/minzip/stated-bean" />
        </a>
      </div>

      <div className="examples">
        <div className="header">Examples</div>

        <section>
          <header>Counter demo with plain object bean</header>
          <iframe src="https://stackblitz.com/edit/stated-bean-counter?embed=1&file=Counter.tsx&hideNavigation=1" />
        </section>

        <section>
          <header>Todo list demo with class bean</header>
          <iframe src="https://stackblitz.com/edit/stated-bean-todo?embed=1&file=todo/index.tsx&hideNavigation=1" />
        </section>
      </div>
    </div>
  );
};
