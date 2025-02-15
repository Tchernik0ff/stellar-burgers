import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

export const fetchOrderData = createAsyncThunk(
  'order/fetchOrderData',
  async (orderId: number) => {
    const response = await getOrderByNumberApi(orderId);
    const targetOrder = response.orders.find(
      (order: TOrder) => order.number === orderId
    );
    return targetOrder;
  }
);

export interface OrderDataState {
  order: TOrder | undefined;
  loading: boolean;
}

const initialState: OrderDataState = {
  order: undefined,
  loading: false
};

const orderDataSlice = createSlice({
  name: 'orderData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка получения данных заказа
      .addCase(fetchOrderData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderData.fulfilled, (state, action) => {
        state.order = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderData.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      });
  }
});

export const getOrder = (state: RootState) => state.order.order;
export const getOrderNumber = (state: RootState) => state.order.order?.number;
export const getLoadingState = (state: RootState) => state.order.loading;
export default orderDataSlice.reducer;
