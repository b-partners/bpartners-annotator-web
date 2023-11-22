import { TaskLoaderArgs } from '.';
import { retryer } from '../../common/utils';
import { teamJobsProvider, userTasksProvider } from '../../providers';

export const taskLoader = async ({ params }: TaskLoaderArgs) => {
  const taskPromise = retryer(async () => await userTasksProvider.getOne(params?.jobId || '', params?.teamId || ''));
  const jobPromise = retryer(async () => await teamJobsProvider.getOne(params?.teamId || '', params?.jobId || ''));

  const [task, job] = await Promise.all([taskPromise, jobPromise]);

  return { task, job };
};
