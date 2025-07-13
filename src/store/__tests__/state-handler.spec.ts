import { lastValueFrom, Subject, take } from 'rxjs';

import { StateHandler } from '../state-handler.js';

class TestStateHandler extends StateHandler<
  { test: string; test2: string },
  { testAction: () => void }
> {
  constructor(withDevTools?: boolean) {
    super({
      initialState: {
        test: 'testValue',
        test2: 'testValue2',
      },
      ...(withDevTools && {
        devTools: {
          enabled: true,
          namespace: 'TestStateHandler',
        },
      }),
    });
  }

  getObservable() {
    return this.getStateAsObservable();
  }

  getActions(): { testAction: () => void } {
    return {
      testAction: () => {
        this.setState({ test: 'newValue' });
      },
    };
  }
}

describe('State Handler', () => {
  let stateHandler: TestStateHandler;

  beforeEach(() => {
    stateHandler = new TestStateHandler();
  });

  it('should provide initial state', () => {
    expect(stateHandler.getInitialState()).toStrictEqual({
      test: 'testValue',
      test2: 'testValue2',
    });
  });

  it('should provide current state', () => {
    expect(stateHandler.getState()).toStrictEqual({
      test: 'testValue',
      test2: 'testValue2',
    });
  });

  it('should support state changing via setter and merge state object on first level', async () => {
    const expected = {
      test: 'change',
      test2: 'testValue2',
    };

    stateHandler.setState(expected);

    const state = await lastValueFrom(stateHandler.getObservable().pipe(take(1)));

    expect(state).toStrictEqual(expected);
    expect(stateHandler.getState()).toStrictEqual(expected);
  });

  it('should support additional subscriptions handling', () => {
    const customSubject = new Subject();
    const spy = jest.fn();
    const subscription = customSubject.subscribe(spy);

    stateHandler.subscriptions = [subscription];

    customSubject.next(1);

    stateHandler.destroy();

    customSubject.next(2);
    customSubject.next(3);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should only call subscriber when object state has changed', async () => {
    const spy = jest.fn();

    stateHandler.getObservable().subscribe(spy);
    stateHandler.setState({
      test: 'test',
    });
    stateHandler.setState({
      test: 'test2',
    });
    stateHandler.setState({
      test: 'test2',
    });
    stateHandler.setState({
      test: 'test2',
    });

    expect(spy).toHaveBeenCalledTimes(3); // 1. testValue (Initial value), 2. test (first setter), 3. test2 (second setter)
  });
});
