import { Box, Button, Card, CardContent, CardHeader, Stack, TextField } from '@mui/material';
import { login_button_container, login_card_content, login_container } from './style';

export const Login = () => {
  return (
    <Box sx={login_container}>
      <Card>
        <CardHeader title='Connexion' />
        <CardContent sx={login_card_content}>
          <form>
            <Stack spacing={2}>
              <TextField name='email' label='Email' variant='outlined' type='text' />
              <TextField name='password' label='Mot de passe' variant='outlined' type='password' />
              <div style={login_button_container}>
                <Button>Se connecter</Button>
              </div>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
