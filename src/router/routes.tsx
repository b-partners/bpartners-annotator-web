import { createBrowserRouter } from 'react-router-dom';
import { TopBarLayout } from '../common/components/layout';
import { Home, JobList, TaskBoard } from '../pages';
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
      {
        path: '/teams/:teamId/jobs/:jobId/task/:taskId',
        element: <TaskBoard />,
      },
    ],
  },
]);

export default AppRouter;
