import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './common/utils/theme';
import AppRouter from './router/routes';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                    <RouterProvider router={AppRouter} />
                </SnackbarProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
