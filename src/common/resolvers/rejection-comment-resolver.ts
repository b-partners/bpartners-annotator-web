import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';

const rejectionCommentSchema = zod.object({
    comment: zod.string({ required_error: FieldErrorMessage.required })
});

export const rejectionCommentDefaultValues = {
    comment: ''
};

export const rejectionCommentResolver = zodResolver(rejectionCommentSchema);
