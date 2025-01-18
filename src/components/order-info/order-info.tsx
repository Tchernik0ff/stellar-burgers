import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from 'react-redux';
import { getIngredients } from '../../slices/ingredientsSlice';
import {
  fetchOrderData,
  getOrder,
  getLoadingState
} from '../../slices/orderDataSlice';
import { useParams } from 'react-router-dom';
import { AppDispatch } from 'src/services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch: AppDispatch = useDispatch();

  const orderData = useSelector(getOrder);

  const loading = useSelector(getLoadingState);

  const ingredients: TIngredient[] = useSelector(getIngredients);

  useEffect(() => {
    dispatch(fetchOrderData(Number(number)));
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || loading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
