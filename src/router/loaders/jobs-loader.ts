import { JobsLoaderArgs } from '.';
import { retryer } from '../../common/utils';
import { teamJobsProvider } from '../../providers';

export const jobsLoader = async ({ params }: JobsLoaderArgs) => {
    let jobs = await retryer(async () => await teamJobsProvider.getList(params?.teamId || ''));

    if (!!jobs) {
        jobs = jobs.filter(
            job => !!job.taskStatistics?.remainingTasksForUserId && job.taskStatistics?.remainingTasksForUserId > 0
        );
    }

    return { jobs };
};
