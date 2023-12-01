import { NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
import { Box, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { page_list_card_action, page_list_card_content, page_list_container } from '.';
import { useGetPrevRoute } from '../../hooks';
import { BpButton } from '../basics';

export const ListPageLayout = () => {
  const getPath = useGetPrevRoute();
  const [isLoading, setLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleClick = () => {
    setLoading(true);
    navigate(getPath());
  };

  return (
    <Box sx={page_list_container}>
      <Card>
        <CardHeader title='Liste des jobs' />
        <CardContent sx={page_list_card_content}>
          <Outlet />
        </CardContent>
        <CardActions sx={page_list_card_action}>
          <BpButton variant='text' startIcon={<NavigateBeforeIcon />} onClick={handleClick} isLoading={isLoading} label='Retour' />
        </CardActions>
      </Card>
    </Box>
  );
};
