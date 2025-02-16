import ingredientSliceReducer, { fetchIngredients, getBuns, getIngLoadingStatus, getIngredients, getMains, getSauces, setBuns, setMains, setSauces, initialState } from './ingredientsSlice'

  const mockBun = [
    {
    _id: 'ingredient1',
    type: 'bun',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image1.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 1',
    id: 'uniqueId1'
  }
];

const mockMain = [
  {
    _id: 'ingredient2',
    type: 'main',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image2.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 2',
    id: 'uniqueId2'
  }
];

const mockSauce = [
  {
    _id: 'ingredient3',
    type: 'sauce',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image3.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 3',
    id: 'uniqueId3'
  }
];

const mockIngredients = [
  {
    _id: 'ingredient1',
    type: 'bun',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image1.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 1',
    id: 'uniqueId1'
  },
  {
    _id: 'ingredient2',
    type: 'main',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image2.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 2',
    id: 'uniqueId2'
  },
  {
    _id: 'ingredient3',
    type: 'sauce',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image3.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 3',
    id: 'uniqueId3'
  }
]

const selectorState = {
  buns: [{
    _id: 'ingredient1',
    type: 'bun',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image1.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 1',
    id: 'uniqueId1'
  }],
  mains: [{
    _id: 'ingredient2',
    type: 'main',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image2.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 2',
    id: 'uniqueId2'
  }],
  sauces: [{
    _id: 'ingredient3',
    type: 'sauce',
    proteins: 123,
    fat: 123,
    carbohydrates: 123,
    calories: 123,
    price: 123,
    image: 'image3.jpg',
    image_large: 'test2.jpg',
    image_mobile: 'test2mobile.jpg',
    name: 'Test Ing 3',
    id: 'uniqueId3'
  }],
  ingredients: [
    {
      _id: 'ingredient1',
      type: 'bun',
      proteins: 123,
      fat: 123,
      carbohydrates: 123,
      calories: 123,
      price: 123,
      image: 'image1.jpg',
      image_large: 'test2.jpg',
      image_mobile: 'test2mobile.jpg',
      name: 'Test Ing 1',
      id: 'uniqueId1'
    },
    {
      _id: 'ingredient2',
      type: 'main',
      proteins: 123,
      fat: 123,
      carbohydrates: 123,
      calories: 123,
      price: 123,
      image: 'image2.jpg',
      image_large: 'test2.jpg',
      image_mobile: 'test2mobile.jpg',
      name: 'Test Ing 2',
      id: 'uniqueId2'
    },
    {
      _id: 'ingredient3',
      type: 'sauce',
      proteins: 123,
      fat: 123,
      carbohydrates: 123,
      calories: 123,
      price: 123,
      image: 'image3.jpg',
      image_large: 'test2.jpg',
      image_mobile: 'test2mobile.jpg',
      name: 'Test Ing 3',
      id: 'uniqueId3'
    }
  ],
  loading: false
}

describe('Тест ingredientSlice', () => {
  const selectorsTest = { ingredients: selectorState};

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    });

  afterAll(()=> {
    jest.clearAllMocks();
  });

  it('Должно инициализироваться с правильным начальным состоянием', () => {
    const state = ingredientSliceReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
  
  it('Тест setBun установка булки', () => {
    const state = ingredientSliceReducer(initialState, setBuns(mockBun));
    expect(state.buns).toEqual(mockBun);
    expect(state.mains).toEqual([]);
    expect(state.sauces).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('Тест setMains установка основных ингредиентов', () => {
    const state = ingredientSliceReducer(initialState, setMains(mockMain));
    expect(state.mains).toEqual(mockMain);
    expect(state.buns).toEqual([]);
    expect(state.sauces).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('Тест setMains установка соусов', () => {
    const state = ingredientSliceReducer(initialState, setSauces(mockSauce));
    expect(state.sauces).toEqual(mockSauce);
    expect(state.buns).toEqual([]);
    expect(state.mains).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('Тест fetchIngredients (состояние pending)', () => {
    const state = ingredientSliceReducer(initialState, fetchIngredients.pending('mockRequestId'));
    expect(state.loading).toBe(true);
  });

  it('Тест fetchIngredients (состояние fulfilled)', () => {
    const state = ingredientSliceReducer(initialState, fetchIngredients.fulfilled(mockIngredients, 'mockRequestId'));
    expect(state.loading).toBe(false);
    expect(state.buns).toEqual([mockIngredients[0]]);
    expect(state.mains).toEqual([mockIngredients[1]]);
    expect(state.sauces).toEqual([mockIngredients[2]]);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('Тест fetchIngredients (состояние rejected)', () => {
    console.log = jest.fn();
    
    const state = ingredientSliceReducer(initialState, fetchIngredients.rejected({
      message: 'failed fetchIngredients'
    } as Error, 'mockRequestId'));
    expect(state.loading).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed fetchIngredients');
  });

  it('Тест селектора getIngredients', () => {
    const result = getIngredients(selectorsTest);
    expect(result).toEqual(selectorsTest.ingredients.ingredients);
  });

  it('Тест селектора getIngLoadingStatus', () => {
    const result = getIngLoadingStatus(selectorsTest);
    expect(result).toBe(false);
  });

  it('Тест селектора getBuns', () => {
    const result = getBuns(selectorsTest);
    expect(result).toEqual(selectorsTest.ingredients.buns);
  });

  it('Тест селектора getMains', () => {
    const result = getMains(selectorsTest);
    expect(result).toEqual(selectorsTest.ingredients.mains);
  });

  it('Тест селектора getSauces', () => {
    const result = getSauces(selectorsTest);
    expect(result).toEqual(selectorsTest.ingredients.sauces);
  });
});