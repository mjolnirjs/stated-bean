import { ForceUpdate, StatedBeanContainer, StatedBeanSymbol } from '../core';

import { ClassType } from './ClassType';

export type StatedBeanType<Bean> = Bean & {
  constructor: ClassType<Bean>;
  readonly [StatedBeanSymbol]: {
    identity: string | symbol;
    container: StatedBeanContainer;
  };
  readonly [ForceUpdate]: (field: keyof Bean) => void;
};
