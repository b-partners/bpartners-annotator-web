import { ErrorRounded as ErrorRoundedIcon } from '@mui/icons-material';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useWaiter } from '../common/hooks';
import { authProvider } from '../providers';
import { container_center_flex } from './style';

export const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError() as Error;
  const [isSessionOff, setIsSessionOff] = useState(false);

  const wait = useWaiter(3, () => navigate('/'));

  useEffect(() => {
    const checker = async () => {
      const isAuthenticated = await authProvider.isAuthenticated();
      if (isAuthenticated) {
        setIsSessionOff(true);
      } else {
        const redirectionUrl = await authProvider.logOut();
        navigate(redirectionUrl);
      }
    };
    checker();
    return () => {
      setIsSessionOff(false);
    };
  }, [navigate]);

  return (
    <Box sx={container_center_flex}>
      {!isSessionOff ? (
        <CircularProgress />
      ) : (
        <Stack spacing={1}>
          <Stack direction='row' spacing={2} alignItems='center'>
            <ErrorRoundedIcon sx={{ fontSize: '2rem' }} color='error' />
            <Typography color='error' fontSize='2rem'>
              {error?.name}
            </Typography>
          </Stack>
          <Stack sx={{ width: 400, bgcolor: '#00000010', borderRadius: 2, padding: 2 }}>
            <Typography>{error?.message}</Typography>
          </Stack>
          <Typography color='text.secondary' fontSize='0.9rem'>
            Vous allez être redirigés dans {wait}s
          </Typography>
        </Stack>
      )}
    </Box>
  );
};
