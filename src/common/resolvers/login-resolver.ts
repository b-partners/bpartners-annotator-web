import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';
import { useForm } from 'react-hook-form';

const loginSchema = zod.object({
    username: zod
        .string({ required_error: FieldErrorMessage.required })
        .min(1, { message: FieldErrorMessage.required })
        .email({ message: FieldErrorMessage.invalidEmail }),
    password: zod
        .string({ required_error: FieldErrorMessage.required })
        .min(1, { message: FieldErrorMessage.required }),
});

export const loginDefaultValues = {
    username: '',
    password: '',
};

export const loginResolver = zodResolver(loginSchema);
export type Credentials = zod.infer<typeof loginSchema>;

export const useLoginForm = () => useForm({ mode: 'all', resolver: loginResolver, defaultValues: loginDefaultValues })