import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TIngredient, TOrder } from '@utils-types';

export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});

interface FeedState {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  ingredients: TIngredient[];
  loading: boolean;
}

const initialState: FeedState = {
  orders: [],
  feed: { total: 0, totalToday: 0 },
  ingredients: [],
  loading: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка получения данных ленты
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
        state.orders = action.payload.orders;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      });
  },
  selectors: {
    getFeedLoadingState: (state) => state.loading,
    getFeedOrders: (state) => state.orders,
    getFeedStats: (state) => state.feed
  }
});

export const { getFeedLoadingState, getFeedOrders, getFeedStats } =
  feedSlice.selectors;
export default feedSlice.reducer;
