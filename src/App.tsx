import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './common/utils/theme';
import AppRouter from './router/routes';
import { SnackbarProvider } from 'notistack';

function App() {
    return (
        <ThemeProvider>
            <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
                <RouterProvider router={AppRouter} />
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
