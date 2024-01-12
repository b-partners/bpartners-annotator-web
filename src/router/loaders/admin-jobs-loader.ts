import { paginationUrlHandler, retryer } from '../../common/utils';
import { jobsProvider } from '../../providers';

export const adminJobsLoader = async () => {
    const { page, perPage, status } = paginationUrlHandler({ jobStatus: undefined });
    const jobs = await retryer(async () => await jobsProvider.getList(page, perPage, status));
    return { jobs, page, perPage, status };
};
