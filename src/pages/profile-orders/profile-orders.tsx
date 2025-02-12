import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getLoadingStatus,
  getUserOrders,
  userOrders
} from '../../slices/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
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
