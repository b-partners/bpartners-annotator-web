import { LoginOutlined as LoginOutlinedIcon } from '@mui/icons-material';
import { Divider, Stack } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField, BpTextField } from '../common/components/basics';
import { LoginLayout } from '../common/layout';
import { useLoginForm } from '../common/resolvers';
import { ICredential, authProvider } from '../providers';
import { login_button_container } from './style';

const useMutateLogin = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationKey: ['login'],
        mutationFn: (data: ICredential) => authProvider.login(data),
        onSuccess: data => navigate(data),
    });
};

export const Login = () => {
    const { mutate, isLoading } = useMutateLogin();

    const form = useLoginForm();

    const handleSubmit = form.handleSubmit(data => mutate(data));

    return (
        <LoginLayout title='Connection'>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <BpTextField name='username' label='Email' variant='outlined' />
                        <BpPasswordField name='password' label='Mot de passe' variant='outlined' />
                        <div style={login_button_container}>
                            <BpButton
                                type='submit'
                                isLoading={isLoading}
                                label='Se connecter'
                                icon={<LoginOutlinedIcon />}
                            />
                        </div>
                        <Divider />
                        <Stack>
                            <Link to='/login/api-key'>Utiliser une clé d'api ?</Link>
                        </Stack>
                    </Stack>
                </form>
            </FormProvider>
        </LoginLayout>
    );
};
