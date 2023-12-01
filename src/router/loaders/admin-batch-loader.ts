import { retryer } from '../../common/utils';
import { jobsProvider, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { BatchLoaderArgs } from './types';

export const adminBatchLoader = async ({ params }: BatchLoaderArgs) => {
  const batchsPromise = await retryer(async () => await annotationsProvider.getBatchs(params?.jobId || '', params?.taskId || ''));
  const taskPromise = await retryer(async () => await tasksProvider.getOne(params?.jobId || '', params?.taskId || ''));
  const jobPromise = await retryer(async () => await jobsProvider.getOne(params?.jobId || ''));

  const [batchs, task, job] = await Promise.all([batchsPromise, taskPromise, jobPromise]);

  return { batchs, task, job };
};
