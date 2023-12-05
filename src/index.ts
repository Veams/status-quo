import { useStateFactory, useStateSingleton } from './hooks/index.js';
import { makeStateSingleton, StateHandler } from './store/index.js';

import type { StateSingleton } from './store/index.js';
import type { StateSubscriptionHandler } from './types/types.js';

export { makeStateSingleton, StateHandler, useStateFactory, useStateSingleton };

export type { StateSingleton, StateSubscriptionHandler };
