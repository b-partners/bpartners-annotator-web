import { getTaskToValidate, retryer, urlParamsHandler } from '../../common/utils';
import { jobsProvider, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { BatchLoaderArgs } from './types';

export const adminBatchLoader = async ({ params }: BatchLoaderArgs) => {
    const tasks = await retryer(tasksProvider.getList(params?.jobId || ''));
    const toValidate = getTaskToValidate(tasks || []);

    console.log(toValidate);

    const taskId = toValidate?.id || '';
    const { setParam } = urlParamsHandler({ taskId: toValidate?.id || '' });

    setParam('taskId', taskId);

    const batchsPromise = await retryer(annotationsProvider.getBatchs(params?.jobId || '', taskId));
    // const taskPromise = await retryer(tasksProvider.getOne(params?.jobId || '', taskId));
    const jobPromise = await retryer(jobsProvider.getOne(params?.jobId || ''));

    const [batchs, job] = await Promise.all([batchsPromise, jobPromise]);

    return { batchs, task: toValidate, job, tasks };
};
