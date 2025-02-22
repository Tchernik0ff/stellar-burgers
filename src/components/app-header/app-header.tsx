import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUser } from '../../slices/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(getUser)?.name;

  return <AppHeaderUI userName={userName} />;
};
