import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

interface ConstructorItems {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

interface BurgerState {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  loading: boolean;
}

const initialState: BurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  loading: false
};

export const orderBurger = createAsyncThunk(
  'order/create',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

const burgerSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setConstructorItems(state, action: PayloadAction<ConstructorItems>) {
      state.constructorItems = action.payload;
    },
    setBun(state, action) {
      state.constructorItems.bun = action.payload;
    },
    setIngredient: {
      reducer(state, action) {
        state.constructorItems.ingredients = [
          ...state.constructorItems.ingredients,
          action.payload
        ];
      },
      prepare(ingredient) {
        const generatedKey = nanoid();
        return {
          payload: {
            ...ingredient,
            id: generatedKey
          },
          meta: {},
          error: null
        };
      }
    },
    removeIngredient(state, action) {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    moveIngridientUp(state, action) {
      const targetIndex = action.payload;
      if (targetIndex >= 0) {
        const ingredients = [...state.constructorItems.ingredients];
        const [ingredientToMove] = ingredients.splice(targetIndex, 1);
        ingredients.splice(targetIndex - 1, 0, ingredientToMove);
        return {
          ...state,
          constructorItems: {
            ...state.constructorItems,
            ingredients
          }
        };
      }
    },
    moveIngridientDown(state, action) {
      const targetIndex = action.payload;
      if (targetIndex >= 0) {
        const ingredients = [...state.constructorItems.ingredients];
        const [ingredientToMove] = ingredients.splice(targetIndex, 1);
        ingredients.splice(targetIndex + 1, 0, ingredientToMove);
        return {
          ...state,
          constructorItems: {
            ...state.constructorItems,
            ingredients
          }
        };
      }
    },
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
    // Обработка создания нового заказа
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        console.log(action.error.message);
      });
  },
  selectors: {
    getConstructorItems: (state) => state.constructorItems,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData
  }
});

export const {
  setConstructorItems,
  setBun,
  setIngredient,
  removeIngredient,
  moveIngridientUp,
  moveIngridientDown,
  reset
} = burgerSlice.actions;
export default burgerSlice.reducer;
export const { getConstructorItems, getOrderModalData, getOrderRequest } =
  burgerSlice.selectors;
