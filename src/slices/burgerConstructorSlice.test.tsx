jest.mock('@reduxjs/toolkit', () => {
  const originalToolkit = jest.requireActual('@reduxjs/toolkit');
  return {
    ...originalToolkit,
    nanoid: jest.fn(() => 'generatedId'),
  };
});

import burgerSliceReducer, { moveIngridientDown, moveIngridientUp, orderBurger, removeIngredient, reset, setBun, setConstructorItems, setIngredient, initialState } from './burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const testIngredients: TConstructorIngredient[] = [
  {
    _id: 'ingredient1',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 50,
    image: 'image1.jpg',
    image_large: 'image1_large.jpg',
    image_mobile: 'image1_mobile.jpg',
    name: 'Test Ing 1',
    id: 'uniqueId1',
  },
  {
    _id: 'ingredient2',
    type: 'main',
    proteins: 15,
    fat: 8,
    carbohydrates: 25,
    calories: 200,
    price: 70,
    image: 'image2.jpg',
    image_large: 'image2_large.jpg',
    image_mobile: 'image2_mobile.jpg',
    name: 'Test Ing 2',
    id: 'uniqueId2',
  },
  {
    _id: 'ingredient3',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 30,
    calories: 250,
    price: 90,
    image: 'image3.jpg',
    image_large: 'image3_large.jpg',
    image_mobile: 'image3_mobile.jpg',
    name: 'Test Ing 3',
    id: 'uniqueId3',
  },
];

const mockOrderResponse = {
  success: true,
  order:  {
    _id: 'testId',
    status: 'pending',
    name: 'testOrderName',
    createdAt: '2025-01-01T12:00:00.000Z',
    updatedAt: '2025-01-01T12:00:00.000Z',
    number: 123456,
    ingredients: ['123', '321']
},
  name: 'Test Name'
}

const mockIngredients = ['123', '321'];

describe('Burger Slice', () => {
  afterEach(() => {
    jest.resetModules();
  })

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('Должен инициализироваться с корректным стейтом', () => {
    const state = burgerSliceReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('setBun должен добавлять булку', () => {
    const testBun = { id: 'bun1', name: 'testBun' };

    const newState = burgerSliceReducer(initialState, setBun(testBun));
    expect(newState.constructorItems.bun).toEqual(testBun);
  });

  it('setIngredient должен добавлять ингредиент с уникальным id ', () => {
    const testIngredient = { _id: '123456' ,name: 'testIngredient' };
    
    const newState = burgerSliceReducer(initialState, setIngredient(testIngredient));
    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual({ ...testIngredient, id: 'generatedId'});
  });

  it('moveIngridientUp должен перемещать ингредиент вверх', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    }

    const newState = burgerSliceReducer(stateTest, moveIngridientUp(2))
    expect(newState.constructorItems.ingredients).toEqual([
      testIngredients[0],
      testIngredients[2],
      testIngredients[1],
    ]);
  })

  it('moveIngridientDown должен перемещать ингредиент вниз', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    }

    const newState = burgerSliceReducer(stateTest, moveIngridientDown(0))
    expect(newState.constructorItems.ingredients).toEqual([
      testIngredients[1],
      testIngredients[0],
      testIngredients[2],
    ]);
  })

  it('moveIngridientUp не должен перемещать ингридиент вверх если он первый', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    }

    // Двигаем ингредиент в начало, проверяем что он переместился
    const newStateFirstStep = burgerSliceReducer(stateTest, moveIngridientUp(1));
    expect(newStateFirstStep.constructorItems.ingredients).toEqual([
      testIngredients[1],
      testIngredients[0],
      testIngredients[2],
    ]);

    // Пытаемся подвинуть его еще раз, проверяем что он не переместился
    const finalStep = burgerSliceReducer(stateTest, moveIngridientUp(0));
    expect(finalStep.constructorItems.ingredients).toEqual([
      testIngredients[1],
      testIngredients[0],
      testIngredients[2],
    ]);
  })

  it('moveIngridientDown не должен перемещать ингредиент вверх если он первый', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    };

    // Перемещаем второй ингредиент вниз
    const newStateFirstStep = burgerSliceReducer(stateTest, moveIngridientDown(1));
    expect(newStateFirstStep.constructorItems.ingredients).toEqual([
      testIngredients[0],
      testIngredients[2],
      testIngredients[1],
    ]);
  
    // Пытаемся переместить последний ингредиент еще ниже
    const finalStep = burgerSliceReducer(newStateFirstStep, moveIngridientDown(2));
    expect(finalStep.constructorItems.ingredients).toEqual([
      testIngredients[0],
      testIngredients[2],
      testIngredients[1],
    ]);
  });

  it('Должен удаляться ингредиент по индексу', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    };

    const newState = burgerSliceReducer(stateTest, removeIngredient(1));
    expect(newState.constructorItems.ingredients).toHaveLength(2);
    expect(newState.constructorItems.ingredients[0].name).toBe('Test Ing 1');
    expect(newState.constructorItems.ingredients[1].name).toBe('Test Ing 3');
  })

  it('Тест setConstructorItems', () => {
    const stateTest = {
      constructorItems: {
        bun: null,
        ingredients: [],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    };

    const testConstructorItems = {
      bun: { 
        _id: 'bunTest',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 50,
        image: 'image1.jpg',
        image_large: 'image1_large.jpg',
        image_mobile: 'image1_mobile.jpg',
        name: 'testBun',
      },
      ingredients: [...testIngredients],
    };

    const newState = burgerSliceReducer(stateTest, setConstructorItems(testConstructorItems));
    expect(newState.constructorItems).toEqual(testConstructorItems);
  })

  it('reset должен сбросить состояние к начальному', () => {
    const stateTest = {
      constructorItems: {
        bun: { 
          _id: 'bunTest',
          type: 'bun',
          proteins: 10,
          fat: 5,
          carbohydrates: 20,
          calories: 150,
          price: 50,
          image: 'image1.jpg',
          image_large: 'image1_large.jpg',
          image_mobile: 'image1_mobile.jpg',
          name: 'testBun',
        },
        ingredients: [...testIngredients],
      },
      orderRequest: false,
      orderModalData: null,
      loading: false,
    };

    const newState = burgerSliceReducer(stateTest, reset());
    expect(newState).toEqual(initialState);
  });

  it('Тест orderBurger (состояние pending)', () => {
    const state = burgerSliceReducer(initialState, orderBurger.pending('mockRequestId', mockIngredients));
    expect(state.orderRequest).toBe(true);
  });

  it('Тест orderBurger (состояние fullfiled)', () => {
    const state = burgerSliceReducer(initialState, orderBurger.fulfilled(mockOrderResponse, 'mockRequestId', mockIngredients));
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrderResponse.order);
  });

  it('Тест orderBurger (состояние rejected)', () => {
    console.log = jest.fn();

    const state = burgerSliceReducer(initialState, orderBurger.rejected({
      message: 'failed orderBurger'
    } as Error, 'mockRequestId', mockIngredients));
    expect(state.orderRequest).toBe(false);
    expect(console.log).toHaveBeenCalledWith('failed orderBurger');
  });
})