import userSliceReducer, { getAuth, getAuthChecked, getLoadingStatus, getLogoutStatus, getUser, getUserOrders, loginUser, logoutUser, registerUser, updateUser, userApi, userOrders } from './userSlice'

const initialState = {
  user: null,
  loading: false,
  error: undefined,
  isAuthenticated: false,
  isAuthChecked: false,
  logoutRequest: false,
  orders: []
}


const stateUserIsLoggedIn = {
  user: {
    name: 'userName',
    email: 'email@email.com'
  },
  loading: false,
  error: undefined,
  isAuthenticated: true,
  isAuthChecked: true,
  logoutRequest: false,
  orders: [{
    _id: '1233456',
    status: 'done',
    name: 'testName',
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-01T12:00:00.000Z',
    number: 654321,
    ingredients: ['123', '321']
}]
}

const userMockData = {
  success: true,
  user: { 
    name: 'userName',
    email: 'email@email.com'
  }
}

const partialUserData = {
  name: 'userNameUpdated'
}

const updatedUserMockData = {
  success: true,
  user: { 
    name: 'userNameUpdated',
    email: 'email@email.com',
    password: 'password'
  }
}

const registerMockData = {
  name: 'userName',
  email: 'email@email.com',
  password: 'password'
}

const loginMockData = {
  email: 'email@email.com',
  password: 'password'
}

const mockAuthResponse = {
  success: true,
  refreshToken: 'refreshTestToken',
  accessToken: 'accessTestToken',
  user: {
    name: 'userName',
    email: 'email@email.com'
  }
}

global.localStorage = {
  length: 0,
  clear: jest.fn(),
  getItem: jest.fn((key: string) => null),
  key: jest.fn((index: number) => null),
  removeItem: jest.fn(),
  setItem: jest.fn(),
};


jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn(),
  deleteCookie: jest.fn(),
}));


describe('Тестирование ленты заказов', () => {
  const selectorState = { user: stateUserIsLoggedIn};

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    });

  afterAll(()=> {
    jest.clearAllMocks();
  });
  
  it('Должно инициализироваться с правильным начальным состоянием', () => {
    const state = userSliceReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Тест registerUser (состояние pending)', () => {
    const state = userSliceReducer(initialState, registerUser.pending('mockRequestId', registerMockData,));
    expect(state.loading).toBe(true);
  });

  it('Тест registerUser (состояние fulfilled)', () => {
    const state = userSliceReducer(initialState, registerUser.fulfilled(mockAuthResponse, 'mockRequestId', registerMockData));
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockAuthResponse.user);
  });

  it('Тест registerUser (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = userSliceReducer(initialState, registerUser.rejected({
      message: 'failed registerUser'
    } as Error, 'mockRequestId', registerMockData));
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed registerUser');
  });

  it('Тест loginUser (состояние pending)', () => {
    const state = userSliceReducer(initialState, loginUser.pending('mockRequestId', loginMockData,));
    expect(state.loading).toBe(true);
  });

  it('Тест loginUser (состояние fulfilled)', () => {
    const state = userSliceReducer(initialState, loginUser.fulfilled(mockAuthResponse, 'mockRequestId', loginMockData));
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true)
    expect(state.user).toEqual(mockAuthResponse.user);
  });

  it('Тест loginUser (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = userSliceReducer(initialState, loginUser.rejected({
      message: 'failed loginUser'
    } as Error, 'mockRequestId', loginMockData));
    expect(state.loading).toBe(false);
    expect(state.user).toBe(null);
    expect(console.log).toHaveBeenCalledWith('failed loginUser');
  });

  it('Тест logoutUser (состояние pending)', () => {
    const state = userSliceReducer(initialState, logoutUser.pending('mockRequestId'));
    expect(state.logoutRequest).toBe(true);
  });

  it('Тест logoutUser (состояние fulfilled)', () => {
    localStorage.setItem('refreshToken', 'mockRefreshToken');
    const state = userSliceReducer(stateUserIsLoggedIn, logoutUser.fulfilled(undefined, 'mockRequestId'));
    expect(state.logoutRequest).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    localStorage.clear();
  });

  it('Тест userApi (состояние pending)', () => {
    const state = userSliceReducer(initialState, userApi.pending('mockRequestId'));
    expect(state.loading).toBe(true);
  });

  it('Тест userApi (состояние fulfilled)', () => {
    const state = userSliceReducer(initialState, userApi.fulfilled(userMockData, 'mockRequestId'));
    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(userMockData.user);
  });

  it('Тест userApi (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = userSliceReducer(initialState, userApi.rejected({
      message: 'failed userApi'
    } as Error, 'mockRequestId', undefined));
    expect(state.loading).toBe(false);
    expect(state.user).toBe(null);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed userApi');
  });

  it('Тест userOrders (состояние pending)', () => {
    const state = userSliceReducer(initialState, userOrders.pending('mockRequestId'));
    expect(state.loading).toBe(true);
  });

  it('Тест userOrders (состояние fulfilled)', () => {
    const state = userSliceReducer(initialState, userOrders.fulfilled(stateUserIsLoggedIn.orders, 'mockRequestId'));
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(stateUserIsLoggedIn.orders);
  });

  it('Тест userOrders (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = userSliceReducer(stateUserIsLoggedIn, userOrders.rejected({
      message: 'failed userOrders'
    } as Error, 'mockRequestId', undefined));
    expect(state.loading).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed userOrders');
  });

  it('Тест updateUser (состояние pending)', () => {
    const state = userSliceReducer(initialState, userOrders.pending('mockRequestId'));
    expect(state.loading).toBe(true);
  });

  it('Тест updateUser (состояние fulfilled)', () => {
    const state = userSliceReducer(stateUserIsLoggedIn, updateUser.fulfilled(updatedUserMockData, 'mockRequestId', partialUserData));
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(updatedUserMockData.user);
  });

  it('Тест updateUser (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = userSliceReducer(stateUserIsLoggedIn, updateUser.rejected({
      message: 'failed updateUser'
    } as Error, 'mockRequestId', partialUserData));
    expect(state.loading).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed updateUser');
  });

  it('Тест селектора getAuth', () => {
    
    const result = getAuth(selectorState);
    expect(result).toBe(true);
  });

  it('Тест селектора getUser', () => {
    const result = getUser(selectorState);
    expect(result).toEqual({
      name: 'userName',
      email: 'email@email.com'
    });
  });

  it('Тест селектора getUserOrders', () => {
    const result = getUserOrders(selectorState);
    expect(result).toEqual([
      {
        _id: '1233456',
        status: 'done',
        name: 'testName',
        createdAt: '2025-01-01T12:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
        number: 654321,
        ingredients: ['123', '321'],
      },
    ]);
  });

  it('Тест селектора getLoadingStatus', () => {
    const result = getLoadingStatus(selectorState);
    expect(result).toBe(false);
  });

  it('Тест селектора getAuthChecked', () => {
    const result = getAuthChecked(selectorState);
    expect(result).toBe(true);
  });

  it('Тест селектора getLogoutStatus', () => {
    const result = getLogoutStatus(selectorState);
    expect(result).toBe(false);
  });
});
