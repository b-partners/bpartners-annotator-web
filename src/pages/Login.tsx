import { LoginOutlined as LoginOutlinedIcon, Person2Outlined as Person2OutlinedIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField, BpTextField } from '../common/components/basics';
import { FieldErrorMessage, loginDefaultValues, loginResolver } from '../common/components/resolvers';
import { authProvider } from '../providers';
import { login_button_container, login_card_content, login_container } from './style';

export const Login = () => {
  const form = useForm({ mode: 'all', resolver: loginResolver, defaultValues: loginDefaultValues });
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit(async data => {
    try {
      setLoading(true);
      const redirection = await authProvider.login(data);
      navigate(redirection);
    } catch (err) {
      console.log(err);

      form.setError('password', { message: FieldErrorMessage.incorrectPassword });
    } finally {
      setLoading(false);
    }
  });

  return (
    <Box sx={login_container}>
      <div className='login-card-container'>
        <Card>
          <CardContent sx={login_card_content}>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <BpTextField name='username' label='Email' variant='outlined' />
                  <BpPasswordField name='password' label='Mot de passe' variant='outlined' />
                  <div style={login_button_container}>
                    <BpButton type='submit' isLoading={isLoading} label='Se connecter' icon={<LoginOutlinedIcon />} />
                  </div>
                </Stack>
              </form>
            </FormProvider>
          </CardContent>
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
