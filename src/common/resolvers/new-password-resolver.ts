import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';

const matchCognitoPassword = (password: string) => {
    const format = /[!@#$%^&*()_+\-=]/;
    if (password.length < 8) {
        return false;
    } else if (!format.test(password)) {
        return false;
    } else if (!/\d/.test(password)) {
        return false;
    } else if (!/[A-Z]/.test(password)) {
        return false;
    }
    return true;
};

const comparePasswords = ({ password, confirmedPassword }: any) => password === confirmedPassword;

const newPasswordSchema = zod
    .object({
        password: zod
            .string({ required_error: FieldErrorMessage.required })
            .min(8, { message: FieldErrorMessage.minPassword })
            .refine(matchCognitoPassword, { message: FieldErrorMessage.badPassword }),
        confirmedPassword: zod.string({ required_error: FieldErrorMessage.required })
    })
    .refine(comparePasswords, { message: FieldErrorMessage.notMatchingPassword, path: ['confirmedPassword'] });

export const newPasswordDefaultValues = {
    password: '',
    confirmedPassword: ''
};

export const newPasswordResolver = zodResolver(newPasswordSchema);
