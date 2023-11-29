import { ReactNode } from 'react';

export interface ResponsiveFontSizesParams {
  sm: number;
  md: number;
  lg: number;
}

export interface ThemeProviderProps {
  children: ReactNode;
}
