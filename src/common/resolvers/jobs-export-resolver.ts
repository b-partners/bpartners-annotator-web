import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';
import { ExportFormat } from '@bpartners-annotator/typescript-client';

const jobsExportSchema: any = zod.object({
    emailCC: zod
        .string({ required_error: FieldErrorMessage.required })
        .min(1, { message: FieldErrorMessage.required })
        .email({ message: FieldErrorMessage.invalidEmail }),
    format: zod.custom(value => value === ExportFormat.COCO || value === ExportFormat.VGG, {
        message: FieldErrorMessage.required,
    }),
});

export const jobsExportDefaultValues = {
    emailCC: '',
    format: ExportFormat.COCO,
};

export const jobsExportResolver = zodResolver(jobsExportSchema);
