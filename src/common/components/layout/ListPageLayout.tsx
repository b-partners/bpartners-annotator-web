import { NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { page_list_card_action, page_list_card_content, page_list_container } from '.';
import { ListPageProvider, useListPageContext } from '../../context';
import { useGetListPageTitle, useGetPrevRoute } from '../../hooks';
import { BpButton } from '../basics';

const Loading = () => {
  const { isLoading, setLoading } = useListPageContext();
  const { pathname } = useLocation();

  useEffect(() => {
    setLoading(false);
  }, [setLoading, pathname]);

  return isLoading ? (
    <Box textAlign='center' sx={{ color: 'text.secondary' }}>
      <CircularProgress />
    </Box>
  ) : (
    <Outlet />
  );
};

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

  const title = useGetListPageTitle();

  return (
    <ListPageProvider>
      <Box sx={page_list_container}>
        <Card>
          <CardHeader title={title} />
          <CardContent sx={page_list_card_content}>
            <Loading />
          </CardContent>
          <CardActions sx={page_list_card_action}>
            <BpButton variant='text' startIcon={<NavigateBeforeIcon />} onClick={handleClick} isLoading={isLoading} label='Retour' />
          </CardActions>
        </Card>
      </Box>
    </ListPageProvider>
  );
};
