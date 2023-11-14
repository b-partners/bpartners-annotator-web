import { createBrowserRouter } from 'react-router-dom';
import { TopBarLayout } from '../common/components/layout';
import { Home, JobList } from '../pages';
import { jobsLoader } from './loaders';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/',
    element: <TopBarLayout />,
    children: [
      {
        loader: jobsLoader,
        path: '/teams/:teamId/jobs',
        element: <JobList />,
      },
    ],
  },
]);

export default AppRouter;
