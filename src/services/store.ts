import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/ingredientsSlice';
import { combineReducers } from '@reduxjs/toolkit';
import burgerReducer from '../slices/burgerConstructorSlice';
import feedReducer from '../slices/feedSlice';
import orderDataReducer from '../slices/orderDataSlice';
import userReducer from '../slices/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerReducer,
  feed: feedReducer,
  order: orderDataReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export { rootReducer };
export default store;
