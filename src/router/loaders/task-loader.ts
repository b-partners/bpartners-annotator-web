import { TaskLoaderArgs } from '.';
import { retryer } from '../../common/utils';
import { jobsProvider, userTasksProvider } from '../../providers';

export const taskLoader = async ({ params }: TaskLoaderArgs) => {
  const taskPromise = retryer(async () => await userTasksProvider.getOne(params?.teamId || '', params?.jobId || ''));
  const jobPromise = retryer(async () => await jobsProvider.getOne(params?.jobId || ''));

  const [task, job] = await Promise.all([taskPromise, jobPromise]);

  return { task, job };
};
