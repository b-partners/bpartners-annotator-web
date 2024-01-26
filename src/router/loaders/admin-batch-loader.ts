import { AnnotationBatch, Job, Task } from '@bpartners-annotator/typescript-client';
import { getTaskToValidate, retryer } from '../../common/utils';
import { jobsProvider, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { BatchLoaderArgs } from './types';

export const adminBatchLoader = async ({ params }: BatchLoaderArgs) => {
    const result: {
        task: Task | null;
        tasks: Task[];
        batchs: AnnotationBatch[];
        job: Job[] | null;
    } = {
        task: null,
        tasks: [],
        batchs: [],
        job: null
    };

    const tasks = await retryer(tasksProvider.getList(params?.jobId || ''));

    if (tasks?.length === 0) return result;
    result.tasks = tasks || [];

    const toValidate = getTaskToValidate(tasks || []);
    if (!toValidate) return result;
    result.task = toValidate;

    const taskId = toValidate?.id || '';

    const batchsPromise = retryer(annotationsProvider.getBatchs(params?.jobId || '', taskId), { ifNotFound: [] });

    const jobPromise = retryer(jobsProvider.getOne(params?.jobId || ''));

    const [batchs, job] = await Promise.all([batchsPromise, jobPromise]);

    return { ...result, batchs, job };
};
