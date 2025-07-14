import { useRef } from 'react';

import { useStateSubscription } from './state-subscription.js';

import type { StateSubscriptionHandler } from '../types/types.js';

export function useStateFactory<V, A, P extends unknown[]>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  params: P = [] as unknown as P
) {
  const stateHandler = useRef(stateFactoryFunction(...params));
  const actions = useRef(stateHandler.current.getActions());
  const state = useStateSubscription(stateHandler.current);

  return [state, actions.current] as [V, A];
}
