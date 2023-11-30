import { NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { page_list_card_action, page_list_card_content, page_list_container } from '.';

export const ListPageLayout = () => {
  return (
    <Box sx={page_list_container}>
      <Card>
        <CardHeader title='Liste des jobs' />
        <CardContent sx={page_list_card_content}>
          <Outlet />
        </CardContent>
        <CardActions sx={page_list_card_action}>
          <Link to='/'>
            <Button size='small' startIcon={<NavigateBeforeIcon />} variant='text'>
              Retour
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
};
