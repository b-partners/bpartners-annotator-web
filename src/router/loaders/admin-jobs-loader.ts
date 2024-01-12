import { retryer, urlParamsHandler } from '../../common/utils';
import { jobsProvider } from '../../providers';

export const adminJobsLoader = async () => {
    const { page, perPage, status } = urlParamsHandler({ status: undefined });
    const jobs = await retryer(async () => await jobsProvider.getList(page, perPage, status as any));
    return { jobs, page, perPage, status: status };
};
