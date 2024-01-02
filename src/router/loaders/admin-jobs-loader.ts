import { retryer } from '../../common/utils';
import { jobsProvider } from '../../providers';

export const adminJobsLoader = async () => {
    const jobs = await retryer(async () => await jobsProvider.getList());
    return { jobs };
};
