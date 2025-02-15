import { rootReducer } from './store'

const userInitialState = {
  user: null,
  loading: false,
  error: undefined,
  isAuthenticated: false,
  isAuthChecked: false,
  logoutRequest: false,
  orders: []
}

const orderDataInitialState = {
  order: undefined,
  loading: false
}

const feedInitialState = {
  orders: [],
  feed: { total: 0, totalToday: 0 },
  loading: false,
}

const burgerConstructorInitialState = {
  constructorItems: {
    bun: null,
    ingredients: [],
  },
  orderRequest: false,
  orderModalData: null,
  loading: false,
}

const ingredientsInitialState = {
  buns: [],
  mains: [],
  sauces: [],
  ingredients: [],
  loading: false
}

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