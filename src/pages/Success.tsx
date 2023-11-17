import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { container_center_flex } from '.';
import bp_logo from '../assets/bp-logo-full.webp';

export const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      navigate('/teams/bf61795f-f701-458e-8b6e-c72814bf036c/jobs');
    }, 2000);
  }, [navigate]);

  return (
    <Box sx={container_center_flex}>
      <Stack>
        <LazyLoadImage alt='bp_logo' width={300} src={bp_logo} />
        <div className='circular-progress-container'>
          <CircularProgress />
        </div>
      </Stack>
      <Typography className='redirection-message'>Vous allez être redirigés vers votre espace personnel.</Typography>
    </Box>
  );
};
