import { useLocation } from 'react-router-dom';

export const useGetPrevRoute = () => {
  const { pathname } = useLocation();

  const path = pathname.split('/');

  return () => path.slice(0, path.length - 2).join('/');
};
