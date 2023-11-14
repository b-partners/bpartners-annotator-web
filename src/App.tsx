import { ThemeProvider } from '@emotion/react';
import { RouterProvider } from 'react-router-dom';
import { bpTheme } from './common/utils';
import AppRouter from './router/routes';

function App() {
  return <ThemeProvider theme={bpTheme}>{<RouterProvider router={AppRouter} />}</ThemeProvider>;
}

export default App;
