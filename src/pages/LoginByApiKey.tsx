import { LoginOutlined as LoginOutlinedIcon } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField } from '../common/components/basics';
import { LoginLayout } from '../common/layout';
import { loginByApiKeyDefaultValues, loginByApiKeyResolver } from '../common/resolvers';
import { cache } from '../common/utils';
import { login_button_container } from './style';

export const LoginByApiKey = () => {
  const form = useForm({ mode: 'all', resolver: loginByApiKeyResolver, defaultValues: loginByApiKeyDefaultValues });
  const navigate = useNavigate();

  const handleSubmit = form.handleSubmit(async data => {
    cache.setApiKey(data.apiKey);
    navigate('/login/success');
  });

  return (
    <LoginLayout title='Connection'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <BpPasswordField name='apiKey' label="Clé d'API" variant='outlined' />
            <div style={login_button_container}>
              <BpButton type='submit' label='Se connecter' icon={<LoginOutlinedIcon />} />
            </div>
          </Stack>
        </form>
      </FormProvider>
    </LoginLayout>
  );
};
