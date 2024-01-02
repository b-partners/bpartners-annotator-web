import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';

const loginByApiKeySchema = zod.object({
    apiKey: zod.string({ required_error: FieldErrorMessage.required }),
});

export const loginByApiKeyDefaultValues = {
    apiKey: '',
};

export const loginByApiKeyResolver = zodResolver(loginByApiKeySchema);
