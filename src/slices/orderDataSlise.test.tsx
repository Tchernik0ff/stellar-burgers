import { RootState } from 'src/services/store';
import orderDataSliceReducer, { fetchOrderData, getLoadingState, getOrder, getOrderNumber, initialState } from './orderDataSlice'

const testState: Partial<RootState> = {
  order: {
    order: {
      _id: '123456',
      number: 123,
      status: 'done',
      name: 'Test Order',
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
      ingredients: ['123', '456'],
    },
    loading: false,
  },
}

const mockOrders = {
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
    ]
}

describe('Тестирование orderData', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  
  afterAll(()=> {
    jest.clearAllMocks();
  });
  
  it('Должно инициализироваться с правильным начальным состоянием', () => {
    const state = orderDataSliceReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Тест fetchOrderData (состояние pending)', () => {
    const state = orderDataSliceReducer(initialState, fetchOrderData.pending('mockRequestId', 123));
    expect(state.loading).toBe(true);
  });

  it('Тест fetchOrderData (состояние fulfilled)', () => {
    const state = orderDataSliceReducer(initialState, fetchOrderData.fulfilled(mockOrders.orders[0], 'mockRequestId', 123));
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(mockOrders.orders[0]);
  });

  it('Тест fetchOrderData (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = orderDataSliceReducer(initialState, fetchOrderData.rejected({
      message: 'failed fetchOrderData'
    } as Error, 'mockRequestId', 123));
    expect(state.loading).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed fetchOrderData');
  });

  it('Тест селектора getOrder', () => {
    const result = getOrder(testState as RootState);
    expect(result).toEqual({
      _id: '123456',
      number: 123,
      status: 'done',
      name: 'Test Order',
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z',
      ingredients: ['123', '456'],
    });
  });

  it('Тест селектора getOrderNumber', () => {
    const result = getOrderNumber(testState as RootState);
    expect(result).toBe(123);
  });

  it('Тест селектора getLoadingState', () => {
    const result = getLoadingState(testState as RootState);
    expect(result).toBe(false);
  });
});
