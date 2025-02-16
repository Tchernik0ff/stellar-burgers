import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

interface IngredientsState {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  ingredients: TIngredient[];
  loading: boolean;
}

const initialState: IngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  ingredients: [],
  loading: false
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setBuns(state, action: PayloadAction<TIngredient[]>) {
      state.buns = action.payload;
    },
    setMains(state, action: PayloadAction<TIngredient[]>) {
      state.mains = action.payload;
    },
    setSauces(state, action: PayloadAction<TIngredient[]>) {
      state.sauces = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка получения ингредиентов
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.buns = action.payload.filter(
          (ingredient) => ingredient.type === 'bun'
        );
        state.mains = action.payload.filter(
          (ingredient) => ingredient.type === 'main'
        );
        state.sauces = action.payload.filter(
          (ingredient) => ingredient.type === 'sauce'
        );
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error.message);
      });
  },
  selectors: {
    getIngredients: (state) => state.ingredients,
    getIngLoadingStatus: (state) => state.loading,
    getBuns: (state) => state.buns,
    getMains: (state) => state.mains,
    getSauces: (state) => state.sauces
  }
});

export const { setBuns, setMains, setSauces } = ingredientsSlice.actions;
export const {
  getIngredients,
  getIngLoadingStatus,
  getBuns,
  getMains,
  getSauces
} = ingredientsSlice.selectors;
export { initialState };
export default ingredientsSlice.reducer;
