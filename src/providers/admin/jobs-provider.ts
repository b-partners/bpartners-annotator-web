import { CrupdateJob, JobStatus } from '@bpartners-annotator/typescript-client';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, jobsApi } from '..';
import { cache, urlParamsHandler } from '../../common/utils';

const ADMIN_JOB_NAME = 'admin-job';

export const jobsProvider = {
    async getOne(jobId: string) {
        const { data } = await jobsApi().getJob(jobId);
        return data;
    },
    async getList(page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, status?: JobStatus) {
        const { data: currentJob } = await jobsApi().getJobs(page, perPage, status);
        if (page === cache.getLastPage(ADMIN_JOB_NAME, perPage)) {
            const { data: nextJob } = await jobsApi().getJobs(page + 1, perPage, status);
            if (nextJob.length > 0) cache.setLastPage(ADMIN_JOB_NAME, page + 1, perPage);
        }
        return currentJob;
    },
    async createOne(jobId: string, job: CrupdateJob) {
        const { data } = await jobsApi().saveJob(jobId, job);
        return data;
    },
    getLastPage: () => cache.getLastPage(ADMIN_JOB_NAME, urlParamsHandler().perPage)
};
