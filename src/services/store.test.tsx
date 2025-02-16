import { rootReducer } from './store';
import { initialState as ingredientsInitialState} from '../slices/ingredientsSlice';
import { initialState as userInitialState } from '../slices/userSlice';
import { initialState as orderDataInitialState} from '../slices/orderDataSlice';
import { initialState as feedInitialState} from '../slices/feedSlice';
import { initialState as burgerConstructorInitialState} from '../slices/burgerConstructorSlice';

describe('Store', () => {
  it('RootReducer должен корректно инициализироваться', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      feed: feedInitialState,
      order: orderDataInitialState,
      user: userInitialState,
    });
  });

  it('RootReducer должен игнорировать неизвестные экшены', () => {
    const initialState = rootReducer(undefined, { type: '' });

    const nextState = rootReducer(initialState, { type: 'ANOTHER_UNKNOWN_ACTION' });

    expect(nextState).toEqual(initialState);
  });
})