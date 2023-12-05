import type { StateSubscriptionHandler } from '../types/types.js';

export interface StateSingleton<V, A> {
  getInstance: () => StateSubscriptionHandler<V, A>;
}

export function makeStateSingleton<S, A>(
  stateHandlerFactory: () => StateSubscriptionHandler<S, A>
): StateSingleton<S, A> {
  let instance: StateSubscriptionHandler<S, A> | null = null;

  return {
    getInstance() {
      if (!instance) {
        instance = stateHandlerFactory();
      }

      return instance;
    },
  };
}
