import { Check as CheckIcon } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BpButton, BpPasswordField } from '../common/components/basics';
import { LoginLayout } from '../common/layout';
import { FieldErrorMessage, newPasswordDefaultValues, newPasswordResolver } from '../common/resolvers';
import { authProvider } from '../providers';
import { login_button_container } from './style';

export const NewPassword = () => {
    const form = useForm({ mode: 'all', resolver: newPasswordResolver, defaultValues: newPasswordDefaultValues });
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = form.handleSubmit(async data => {
        try {
            setLoading(true);
            const redirection = await authProvider.updatePassword(data.confirmedPassword);
            navigate(redirection);
        } catch (err) {
            console.log(err);

            form.setError('password', { message: FieldErrorMessage.incorrectPassword });
        } finally {
            setLoading(false);
        }
    });

    return (
        <LoginLayout title='Nouveau mot de passe'>
            <FormProvider {...form}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <BpPasswordField name='password' label='Nouveau mot de passe' variant='outlined' />
                        <BpPasswordField
                            name='confirmedPassword'
                            label='Confirmez le mot de passe'
                            variant='outlined'
                        />
                        <div style={login_button_container}>
                            <BpButton type='submit' isLoading={isLoading} label='Valider' icon={<CheckIcon />} />
                        </div>
                    </Stack>
                </form>
            </FormProvider>
        </LoginLayout>
    );
};
