import { AppBar, Box, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Outlet, useNavigate } from 'react-router-dom';
import BP_LOGO from '../../../assets/bp-white-logo.png';
import { authProvider } from '../../../providers';
import { DialogProvider } from '../../context';
import { cache } from '../../utils';
import { BpButton } from '../basics';

export const TopBarLayout = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    authProvider
      .logOut()
      .then(redirection => {
        navigate(redirection);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const accessToken = cache.getAccessToken();
    const apiKey = cache.getApiKey();
    if ((!accessToken || accessToken.length === 0) && (!apiKey || apiKey.length === 0)) navigate('/login');
  }, [navigate]);

  return (
    <DialogProvider>
      <AppBar position='relative' sx={{ height: '64px' }}>
        <Toolbar>
          <LazyLoadImage src={BP_LOGO} alt='BpLogo' width={120} />
          <Box flexGrow={2}></Box>
          <BpButton variant='text' sx={{ color: '#fff' }} label='Se déconnecter' isLoading={isLoading} onClick={logout} />
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
    </DialogProvider>
  );
};
