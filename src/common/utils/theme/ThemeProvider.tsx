import { FC, useMemo } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { Components, createTheme, ThemeProvider as MUIThemeProvider, ThemeOptions } from '@mui/material/styles';

import { customShadows, overrides, palette, shadows, ThemeProviderProps, typography } from '.';

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const memoizedValue = useMemo(
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
    }),
    []
  );

  const theme = createTheme(memoizedValue as any as ThemeOptions);

  theme.components = overrides(theme) as Components;

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};
