import { StatedBeanContainer, StatedBeanWrapper } from '../core';

import { ClassType } from './ClassType';

export type StatedBeanType<Bean> = Bean & {
  constructor: ClassType<Bean>;
  readonly [StatedBeanWrapper]: {
    identity: string | symbol;
    type: ClassType<Bean>;
    container: StatedBeanContainer;
    forceUpdate: (field: keyof Bean) => void;
  };
};
