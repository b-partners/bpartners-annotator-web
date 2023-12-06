import { useLocation } from 'react-router-dom';

export const useGetPrevRoute = (routeToSkip = 2) => {
  const { pathname } = useLocation();

  const path = pathname.split('/');

  return () => path.slice(0, path.length - routeToSkip).join('/');
};
