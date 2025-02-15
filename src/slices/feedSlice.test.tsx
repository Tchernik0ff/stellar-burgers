import feedSliceReducer, { fetchFeed, getFeedLoadingState, getFeedOrders, getFeedStats, initialState } from './feedSlice'

const feedResponseMock = {
  success: true,
  orders: [
    {
      _id: '123',
      status: 'pending',
      name: 'testOrder1',
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
      number: 123456,
      ingredients: ['123', '321']
    },
    {
      _id: '456',
      status: 'pending',
      name: 'testOrder2',
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
      number: 654321,
      ingredients: ['321', '123']
    }
  ],
  total: 2,
  totalToday: 0,
}

const expectedFulfilled = {
    orders: [
      {
        _id: '123',
        status: 'pending',
        name: 'testOrder1',
        createdAt: '2025-01-01T12:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
        number: 123456,
        ingredients: ['123', '321']
      },
      {
        _id: '456',
        status: 'pending',
        name: 'testOrder2',
        createdAt: '2025-01-01T12:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
        number: 654321,
        ingredients: ['321', '123']
    }
    ],
    feed: {
      total: 2,
      totalToday: 0
    },
    loading: false
}

describe('Тестирование ленты заказов', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(()=> {
    jest.clearAllMocks();
  });
  
  it('Должно инициализироваться с правильным начальным состоянием', () => {
    const state = feedSliceReducer(undefined, { type: 'unknown'});
    expect(state).toEqual(initialState);
  });

  it('Тест fetchFeed (состояние pending)', () => {
    const state = feedSliceReducer(initialState, fetchFeed.pending('mockRequestId'));
    expect(state.loading).toBe(true);
  });

  it('Тест fetchFeed (состояние fulfilled)', () => {
    const state = feedSliceReducer(initialState, fetchFeed.fulfilled(feedResponseMock, 'mockRequestId'))
    
    expect(state.loading).toBe(false);
    expect(state).toEqual({
      ...initialState,
      orders: expectedFulfilled.orders,
      feed: expectedFulfilled.feed,
      loading: false,
    });
  });

  it('Тест fetchFeed (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = feedSliceReducer(initialState, fetchFeed.rejected({
      message: 'failed fetchFeed'
    } as Error, 'mockRequestId'));
    expect(state.loading).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed fetchFeed');
  });

  it('Тест селектора getFeedLoadingState',() => {
    const testState = {
      ...initialState,
      loading: true,
    }

    const loading = getFeedLoadingState({ feed: testState});
    expect(loading).toBe(true);
  });

  it('Тест селектора getFeedOrders',() => {
    const feedOrders = getFeedOrders({ feed: expectedFulfilled});
    expect(feedOrders).toEqual(expectedFulfilled.orders);
  });

  it('Тест селектора getFeedStats',() => {
    const feedStats = getFeedStats({ feed: expectedFulfilled });
    expect(feedStats).toEqual(expectedFulfilled.feed);
  });
});
