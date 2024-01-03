import { JobsLoaderArgs } from '.';
import { retryer } from '../../common/utils';
import { teamJobsProvider } from '../../providers';

export const jobsLoader = async ({ params }: JobsLoaderArgs) => {
    const jobs = await retryer(async () => await teamJobsProvider.getList(params?.teamId || ''));
    return { jobs };
};
