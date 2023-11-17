import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { error_container } from './style';

export const Error = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return (
    <Box sx={error_container}>
      <CircularProgress />
    </Box>
  );
};
