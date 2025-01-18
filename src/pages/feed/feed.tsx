import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import {
  fetchFeed,
  getFeedLoadingState,
  getFeedOrders
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const loading = useSelector(getFeedLoadingState);

  const handleUpdate = () => {
    dispatch(fetchFeed());
  };

  const orders: TOrder[] = useSelector(getFeedOrders);

  if (!orders.length || loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleUpdate} />;
};
