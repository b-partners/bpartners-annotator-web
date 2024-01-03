import { retryer } from '../../common/utils';
import { tasksProvider } from '../../providers';
import { TaskLoaderArgs } from './types';

export const adminTasksLoader = async ({ params }: TaskLoaderArgs) => {
    const tasks = await retryer(async () => await tasksProvider.getList(params?.jobId || ''));

    return { tasks };
};
