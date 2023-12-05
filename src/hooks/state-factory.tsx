import { useMemo } from 'react';

import { useStateSubscription } from './state-subscription.js';

import type { StateSubscriptionHandler } from '../types/types.js';

export function useStateFactory<V, A, P extends unknown[]>(
  stateFactoryFunction: (...args: P) => StateSubscriptionHandler<V, A>,
  params: P = [] as unknown as P
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stateHandler = useMemo(() => stateFactoryFunction(...params), params);
  const actions = useMemo(() => stateHandler.getActions(), [stateHandler]);
  const state = useStateSubscription(stateHandler);

  return [state, actions] as [V, A];
}
