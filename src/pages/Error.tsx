import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { container_center_flex } from './style';

export const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <Box sx={container_center_flex}>
      <CircularProgress />
    </Box>
  );
};
