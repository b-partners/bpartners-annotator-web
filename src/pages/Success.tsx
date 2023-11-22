/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { container_center_flex } from '.';
import bp_logo from '../assets/bp-logo-full.webp';
import { retryer } from '../common/utils';
import { accountProvider } from '../providers/account-provider';

export const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getWhoami = async () => {
      try {
        const whoami = await retryer(async () => await accountProvider.whoami());
        if (!!whoami?.user?.team?.id) navigate(`/teams/${whoami.user.team.id}/jobs`);
      } catch (error) {
        console.log(error);
      }
    };
    getWhoami();
  }, []);

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
