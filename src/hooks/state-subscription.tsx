import { useEffect, useState } from 'react';

import type { StateSubscriptionHandler } from '../types/types.js';
import type { SetStateAction } from 'react';

export function useStateSubscription<V, A>(
  stateSubscriptionHandler: StateSubscriptionHandler<V, A>
) {
  const [state, setSubscriptionState] = useState<SetStateAction<V>>(
    stateSubscriptionHandler.getInitialState()
  );

  useEffect(() => {
    const state$ = stateSubscriptionHandler.getObservable().subscribe((data) => {
      setSubscriptionState(data);
    });

    return () => {
      state$.unsubscribe();
      return stateSubscriptionHandler.destroy();
    };
  }, [stateSubscriptionHandler]);

  return state;
}
