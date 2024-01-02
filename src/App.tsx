import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './common/utils/theme';
import AppRouter from './router/routes';

function App() {
    return (
        <ThemeProvider>
            <RouterProvider router={AppRouter} />
        </ThemeProvider>
    );
}

export default App;
