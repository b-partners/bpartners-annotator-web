import { zodResolver } from '@hookform/resolvers/zod';
import zod from 'zod';
import { FieldErrorMessage } from './errors-message';
import { useForm } from 'react-hook-form';

const jobsExportStatisticsSchema: any = zod.object({
    email: zod
        .string({ required_error: FieldErrorMessage.required })
        .min(1, { message: FieldErrorMessage.required })
        .email({ message: FieldErrorMessage.invalidEmail }),
});

export const jobsExportStatisticsDefaultValues = {
    email: '',
};

export const jobsExportStatisticsResolver = zodResolver(jobsExportStatisticsSchema);

type JobsExportStatisticsResolverType = zod.infer<typeof jobsExportStatisticsSchema>;

export const useExportStatisticForm = () =>
    useForm<JobsExportStatisticsResolverType>({
        resolver: jobsExportStatisticsResolver,
        mode: 'all',
        defaultValues: jobsExportStatisticsDefaultValues,
    });
