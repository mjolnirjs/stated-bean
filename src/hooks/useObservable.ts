import { Observable, BehaviorSubject, Subscription } from 'rxjs';

import { useState, useEffect } from 'react';

export function useObservable<T>(observable?: Observable<T>) {
  const [value, setValue] = useState(() => {
    if (observable !== undefined && observable instanceof BehaviorSubject) {
      return observable.getValue();
    }
    return undefined;
  });

  useEffect(() => {
    let subscription: Subscription;
    if (observable !== undefined) {
      subscription = observable.subscribe(value => {
        setValue(value);
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [observable]);

  return value;
}
