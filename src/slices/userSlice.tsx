import {
  registerUserApi,
  loginUserApi,
  TRegisterData,
  TLoginData,
  getUserApi,
  logoutApi,
  getOrdersApi,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie';

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const userOrders = createAsyncThunk('user/orders', async () => {
  const response = await getOrdersApi();
  return response;
});

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.clear();
});

export const userApi = createAsyncThunk('user/get', async () => {
  const response = await getUserApi();
  return response;
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUser',
  (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(userApi()).finally(() => {
        dispatch(authCheсked());
      });
    } else {
      dispatch(authCheсked());
    }
  }
);

interface userState {
  user: TUser | null;
  loading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  logoutRequest: boolean;
  orders: TOrder[];
}

const initialState: userState = {
  user: null,
  loading: false,
  error: undefined,
  isAuthenticated: false,
  isAuthChecked: false,
  logoutRequest: false,
  orders: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheсked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка обновления данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      })
      // Обработка регистрации пользователя
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        console.log(action.error.message);
      })
      // Обработка логина пользователя
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action.error.message);
      })
      // Обработка логаута пользователя
      .addCase(logoutUser.pending, (state) => {
        state.logoutRequest = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutRequest = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('refreshToken');
      })
      // Обработка получения данных пользователя
      .addCase(userApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(userApi.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(userApi.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action.error.message);
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      // Обработка получения заказов пользователя
      .addCase(userOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(userOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(userOrders.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      });
  },
  selectors: {
    getAuth: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getUserOrders: (state) => state.orders,
    getLoadingStatus: (state) => state.loading,
    getAuthChecked: (state) => state.isAuthChecked,
    getLogoutStatus: (state) => state.logoutRequest
  }
});

export const {
  getAuth,
  getUser,
  getLoadingStatus,
  getUserOrders,
  getAuthChecked,
  getLogoutStatus
} = userSlice.selectors;
export const { authCheсked } = userSlice.actions;
export { initialState };
export default userSlice.reducer;
