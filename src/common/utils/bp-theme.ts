import { yellow } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const bpTheme = createTheme({
  palette: {
    primary: {
      main: '#7A003D',
      light: 'rgb(148, 51, 99)',
      dark: 'rgb(85, 0, 42)',
      contrastText: '#fff',
    },
    secondary: {
      main: '#7A003D',
      light: 'rgb(148, 51, 99)',
      dark: 'rgb(85, 0, 42)',
      contrastText: '#fff',
    },
    warning: {
      main: yellow[800],
      light: yellow[100],
      dark: yellow['A100'],
      contrastText: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: '5%',
          marginBottom: '0.2%',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        contained: {
          paddingBlock: '0.5rem',
          borderRadius: '2rem',
          boxShadow: 'none',
          paddingInline: '2rem',
        },
      },
    },
  },
});
