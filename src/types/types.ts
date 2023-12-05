import type { Observable } from 'rxjs';

export interface StateSubscriptionHandler<V, A> {
  getObservable: () => Observable<V>;
  destroy: () => void;
  getInitialState: () => V;
  getActions: () => A;
}
