import { useMemo } from 'react';

import { useStateSubscription } from './state-subscription.js';

import type { StateSingleton } from '../store/state-singleton.js';

export function useStateSingleton<V, A>(stateSingleton: StateSingleton<V, A>) {
  const stateHandler = useMemo(() => stateSingleton.getInstance(), [stateSingleton]);
  const actions = useMemo(() => stateHandler.getActions(), [stateHandler]);

  const state = useStateSubscription(stateHandler);

  return [state, actions] as [V, A];
}
