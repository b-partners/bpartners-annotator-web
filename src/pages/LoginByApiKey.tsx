import { LoginOutlined as LoginOutlinedIcon } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField } from '../common/components/basics';
import { LoginLayout } from '../common/layout';
import { FieldErrorMessage, loginByApiKeyDefaultValues, loginByApiKeyResolver } from '../common/resolvers';
import { cache, retryer } from '../common/utils';
import { accountProvider } from '../providers';
import { login_button_container } from './style';

export const LoginByApiKey = () => {
    const form = useForm({ mode: 'all', resolver: loginByApiKeyResolver, defaultValues: loginByApiKeyDefaultValues });
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = form.handleSubmit(async data => {
        cache.setApiKey(data.apiKey);
        try {
            setLoading(true);
            await retryer(async () => await accountProvider.whoami());
            navigate('/login/success');
        } catch (err) {
            form.setError('apiKey', { message: FieldErrorMessage.invalidKey });
        } finally {
            setLoading(false);
        }
    });

    return (
        <LoginLayout title='Connection'>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <BpPasswordField name='apiKey' label="Clé d'API" variant='outlined' />
                        <div style={login_button_container}>
                            <BpButton
                                type='submit'
                                label='Se connecter'
                                isLoading={isLoading}
                                icon={<LoginOutlinedIcon />}
                            />
                        </div>
                    </Stack>
                </form>
            </FormProvider>
        </LoginLayout>
    );
};
