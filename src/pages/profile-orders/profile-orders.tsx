import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getLoadingStatus,
  getUserOrders,
  userOrders
} from '../../slices/userSlice';
import { Preloader } from '@ui';
import { AppDispatch } from 'src/services/store';

export const ProfileOrders: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);
  const loading = useSelector(getLoadingStatus);

  useEffect(() => {
    dispatch(userOrders());
  }, []);

  if (loading) {
    return <Preloader />;
  }
  return <ProfileOrdersUI orders={orders} />;
};
