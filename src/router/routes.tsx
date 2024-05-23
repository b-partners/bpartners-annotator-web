import { createBrowserRouter } from 'react-router-dom';
import { TopBarLayout } from '../common/components/layout';
import { Error, Home, JobList, Login, LoginByApiKey, NewPassword, Success, TaskBoard } from '../pages';
import { AdminJobList, AdminTaskBoard } from '../pages/admin';

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
                path: '/teams/:teamId/jobs',
                element: <JobList />,
            },
            {
                path: '/jobs',
                element: <AdminJobList />,
            },
            {
                path: '/teams/:teamId/jobs/:jobId',
                element: <TaskBoard />,
            },
            {
                path: '/jobs/:jobId/tasks/review',
                element: <AdminTaskBoard />,
            },
        ],
    },
]);

export default AppRouter;
