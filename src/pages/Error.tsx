import { Avatar, Box, Divider, Paper, Stack, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useRouteError } from 'react-router-dom';
import { error_card_container, error_container } from './style';

export const Error = () => {
  const error = useRouteError() as AxiosError;

  console.log(error);

  return (
    <Box sx={error_container}>
      <Paper sx={error_card_container}>
        <Stack direction='row' spacing={1}>
          <Avatar variant='square'>
            <Typography>{error.code}</Typography>
          </Avatar>
          <Divider />
          <Stack spacing={1} className='error-message-container'>
            <Typography>{error.name}</Typography>
            <Typography>{error.message}</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};
