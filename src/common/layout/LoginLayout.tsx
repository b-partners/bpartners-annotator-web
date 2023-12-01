import { Box, Card, Stack, Typography, alpha, useTheme } from '@mui/material';
import { FC } from 'react';
import { LoginLayoutProps } from '.';
import { useSessionRedirection } from '../hooks';
import { bgGradient } from '../utils/theme';

export const LoginLayout: FC<LoginLayoutProps> = ({ children, title }) => {
  const theme = useTheme();
  useSessionRedirection();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems='center' justifyContent='center' sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant='h4' mb={4}>
            {title}
          </Typography>
          {children}
        </Card>
      </Stack>
    </Box>
  );
};
