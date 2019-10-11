import { BehaviorSubject, Observable } from 'rxjs';

import { useEffect, useRef, useState } from 'react';

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

  const observableRef = useRef(observable);

  useEffect(() => {
    const { current } = observableRef;
    observableRef.current = typeof current === 'function' ? current() : current;
    if (!observableRef.current) {
      return;
    }
    const subscription = observableRef.current.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observableRef]);

  return value;
}
