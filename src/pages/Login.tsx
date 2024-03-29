import { LoginOutlined as LoginOutlinedIcon } from '@mui/icons-material';
import { Divider, Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField, BpTextField } from '../common/components/basics';
import { LoginLayout } from '../common/layout';
import { FieldErrorMessage, loginDefaultValues, loginResolver } from '../common/resolvers';
import { authProvider } from '../providers';
import { login_button_container } from './style';

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
