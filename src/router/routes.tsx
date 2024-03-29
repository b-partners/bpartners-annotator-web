import { createBrowserRouter } from 'react-router-dom';
import { ListPageLayout, TopBarLayout } from '../common/components/layout';
import { Error, Home, JobList, Login, LoginByApiKey, NewPassword, Success, TaskBoard } from '../pages';
import { AdminJobList, AdminTaskBoard } from '../pages/admin';
import { adminBatchLoader, adminJobsLoader, jobsLoader } from './loaders';
import { taskLoader } from './loaders/task-loader';

const AppRouter = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <Error />,
    },
    {
        path: '/login/success',
        element: <Success />,
        errorElement: <Error />,
    },
    {
        path: '/login',
        element: <Login />,
        errorElement: <Error />,
    },
    {
        path: '/login/api-key',
        element: <LoginByApiKey />,
        errorElement: <Error />,
    },
    {
        path: '/login/complete-password',
        element: <NewPassword />,
        errorElement: <Error />,
    },
    {
        path: '/',
        element: <TopBarLayout />,
        errorElement: <Error />,
        children: [
            {
                element: <ListPageLayout />,
                children: [
                    {
                        loader: jobsLoader,
                        path: '/teams/:teamId/jobs',
                        element: <JobList />,
                    },
                ],
            },
            {
                loader: adminJobsLoader,
                path: '/jobs',
                element: <AdminJobList />,
            },
            {
                path: '/teams/:teamId/jobs/:jobId',
                loader: taskLoader,
                element: <TaskBoard />,
            },
            {
                loader: adminBatchLoader,
                path: '/jobs/:jobId/tasks/review',
                element: <AdminTaskBoard />,
            },
        ],
    },
]);

export default AppRouter;
