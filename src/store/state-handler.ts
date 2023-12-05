import { BehaviorSubject, distinctUntilKeyChanged, map, scan, Subject, pipe, distinctUntilChanged } from 'rxjs';

import { withDevTools } from './dev-tools.js';

import type { StateSubscriptionHandler } from '../types/types.js';
import type { DevTools, MessagePayload } from './dev-tools.js';
import type { Observable, Subscription } from 'rxjs';

type Subscriptions = Subscription[];
type StateHandlerProps<S> = {
  initialState: S;
  options?: {
    devTools: {
      enabled?: boolean;
      namespace: string;
    };
  };
};
type StateObservableOptions = { useDistinctUntilChanged?: boolean };

function distinctUntilChangedAsJson<T>() {
  return pipe<Observable<T>, Observable<T>>(
      distinctUntilChanged((a, b) => {
        return JSON.stringify(a) === JSON.stringify(b);
      })
  );
}


const pipeMap = {
  useDistinctUntilChanged: distinctUntilChangedAsJson(),
};

const defaultOptions = { devTools: { enabled: false, namespace: 'Store' } };

export abstract class StateHandler<S, A> implements StateSubscriptionHandler<S, A> {
  private readonly updates$: Subject<{
    actionName: string;
    state: Partial<S>;
  }> = new Subject();

  private readonly state$: BehaviorSubject<S>;
  private readonly initialState: S;

  private devTools: DevTools | null = null;

  subscriptions: Subscriptions = [];

  protected constructor({ initialState, options = defaultOptions }: StateHandlerProps<S>) {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      devTools: {
        ...defaultOptions.devTools,
        ...options?.devTools,
      },
    };
    this.initialState = initialState;
    this.state$ = new BehaviorSubject<S>(initialState);
    this.devTools = mergedOptions.devTools.enabled
      ? withDevTools(this.initialState, {
          name: mergedOptions.devTools.namespace,
          instanceId: mergedOptions.devTools.namespace.toLowerCase().replaceAll(' ', '-'),
          actionCreators: this.getActions(),
          features: {
            pause: true, // start/pause recording of dispatched actions
            lock: true, // lock/unlock dispatching actions and side effects
            persist: false, // persist states on page reloading (Using action creators under the hood which are not bound to our state)
            export: true, // export history of actions in a file
            import: 'custom', // import history of actions from a file
            jump: true, // jump back and forth (time travelling)
            skip: true, // skip (cancel) actions
            reorder: true, // drag and drop actions in the history list
            dispatch: false, // dispatch custom actions or action creators (This is only working in redux reducer context)
            test: false, // generate tests for the selected actions (Reducer like tests make no sense)
          },
        })
      : null;

    this.bindUpdatesAndEvents();
  }

  getInitialState() {
    return this.initialState;
  }

  getState() {
    return this.state$.getValue();
  }

  setState(newState: Partial<S>, actionName = 'change') {
    this.updates$.next({
      state: newState,
      actionName,
    });
  }

  destroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getStateItemAsObservable(key: keyof S) {
    return this.state$.pipe(
      distinctUntilKeyChanged(key),
      map((state) => state[key])
    );
  }

  getStateAsObservable(
    options: StateObservableOptions = {
      useDistinctUntilChanged: true,
    }
  ) {
    // Unfortunately we cannot add pipe operators conditionally in an easy manner.
    // That's why we use a simple object to attach operators to a new state observable via reduce().
    // This way we can easily extend our default operators map.
    return Object.keys(options)
      .filter((optionKey) => options[optionKey as keyof StateObservableOptions] === true)
      .map((enabledOptions) => pipeMap[enabledOptions as keyof StateObservableOptions])
      .reduce((stateObservable$, operator) => {
        return stateObservable$.pipe(operator) as BehaviorSubject<S>;
      }, this.state$);
  }

  getObservableItem(key: keyof S) {
    return this.getStateItemAsObservable(key);
  }

  private bindUpdatesAndEvents() {
    this.updates$
      .pipe(
        scan(
          (current, updated) => {
            const { state: oldState } = current;
            const { state: newState, actionName } = updated;

            return { actionName, state: { ...oldState, ...newState } };
          },
          { actionName: 'init', state: this.initialState } // Initial event object which is changed by this.setState().
        ),
        map(({ actionName, state }) => {
          this.devTools?.send(actionName, state);

          return state;
        })
      )
      .subscribe(this.state$);

    this.devTools?.subscribe(this.handleDevToolsEvents);
  }

  private handleDevToolsEvents = (message: MessagePayload) => {
    if (message.type === 'DISPATCH') {
      switch (message.payload.type) {
        case 'RESET':
          this.state$.next(this.getInitialState());
          this.devTools?.init(this.getInitialState());
          break;

        case 'COMMIT':
          this.state$.next(this.getState());
          this.devTools?.init(this.getState());
          break;

        case 'JUMP_TO_STATE':
        case 'JUMP_TO_ACTION':
          this.state$.next(JSON.parse(message.state));
          break;

        default:
          break;
      }
    }
  };

  getObservable(): Observable<S> {
    return this.getStateAsObservable();
  }

  abstract getActions(): A;
}
