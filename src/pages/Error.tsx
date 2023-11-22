import { ErrorRounded as ErrorRoundedIcon } from '@mui/icons-material';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { useWaiter } from '../common/hooks';
import { container_center_flex } from './style';

const ShowError = () => {
  const error = useRouteError() as Error;
  const wait = useWaiter(3);
  return (
    <>
      <Stack spacing={1}>
        q
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
          - Vous allez être redirigés dans {wait}s
        </Typography>
      </Stack>
    </>
  );
};

export const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError() as AxiosError;

  useEffect(() => {
    let tId: string | number | NodeJS.Timeout | undefined;
    if (error.isAxiosError) navigate('/login');
    else {
      tId = setTimeout(() => {
        navigate('/');
      }, 3000);
    }
    return () => clearTimeout(tId);
  }, [error.isAxiosError, navigate]);

  return <Box sx={container_center_flex}>{error.isAxiosError ? <CircularProgress /> : <ShowError />}</Box>;
};
