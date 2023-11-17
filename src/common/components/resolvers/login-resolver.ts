import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';

const loginSchema = zod.object({
  username: zod.string({ required_error: FieldErrorMessage.required }),
  password: zod.string({ required_error: FieldErrorMessage.required }),
});

export const loginDefaultValues = {
  username: '',
  password: '',
};

export const loginResolver = zodResolver(loginSchema);
