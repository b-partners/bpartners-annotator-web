import { AppBar, Box, Toolbar } from '@mui/material';
import { useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Outlet, useNavigate } from 'react-router-dom';
import BP_LOGO from '../../../assets/bp-white-logo.png';
import { cache } from '../../utils';

export const TopBarLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = cache.getAccessToken();
    if (!accessToken || accessToken.length === 0) navigate('/login');
  }, [navigate]);

  return (
    <>
      <AppBar position='relative' sx={{ height: '64px' }}>
        <Toolbar>
          <LazyLoadImage src={BP_LOGO} alt='BpLogo' width={120} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          height: 'calc(100vh - 68px)',
          width: '100vw',
          margin: 0,
          padding: 0,
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};
