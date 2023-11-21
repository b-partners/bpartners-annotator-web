import { Person2Outlined as Person2OutlinedIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Stack } from '@mui/material';
import { FC } from 'react';
import { LoginLayoutProps, login_card_content, login_container } from '.';

export const LoginLayout: FC<LoginLayoutProps> = ({ children }) => {
  return (
    <Box sx={login_container}>
      <div className='login-card-container'>
        <Card>
          <CardContent sx={login_card_content}>{children}</CardContent>
        </Card>
        <Stack className='login-card-header-container'>
          <Avatar>
            <Person2OutlinedIcon />
          </Avatar>
        </Stack>
      </div>
    </Box>
  );
};
