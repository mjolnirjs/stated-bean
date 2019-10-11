import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { isFunction } from '../utils';

import { useEffect, useState } from 'react';

export type ObservableSource<T> =
  | Observable<T>
  | (() => Observable<T>)
  | null
  | undefined;

export function useObservable<T>(observable?: ObservableSource<T>) {
  const [value, setValue] = useState<T | null>(() => {
    if (observable instanceof BehaviorSubject) {
      return observable.getValue();
    }
    return null;
  });

  const [observer, setObserver] = useState(observable);

  useEffect(() => {
    if (!isFunction(observable)) {
      setObserver(observable);
    }
  }, [observable]);

  useEffect(() => {
    let subscription: Subscription;
    if (observer instanceof Observable) {
      subscription = observer.subscribe(setValue);
    }
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [observer]);

  return value;
}
