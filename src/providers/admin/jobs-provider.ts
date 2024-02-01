import { CrupdateJob, JobStatus } from '@bpartners-annotator/typescript-client';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, jobsApi } from '..';
import { cache, paginationNameByDependencies } from '../../common/utils';

const ADMIN_JOB_NAME = 'admin-job';

export const jobsProvider = {
    getPaginationName: () => ADMIN_JOB_NAME + paginationNameByDependencies(['perPage', 'status']),
    getLastPage() {
        return cache.getLastPage(this.getPaginationName());
    },
    async getOne(jobId: string) {
        const { data } = await jobsApi().getJob(jobId);
        return data;
    },
    async getList(page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, status?: JobStatus) {
        const { data: currentJob } = await jobsApi().getJobs(page, perPage, status || undefined);
        console.log(page, this.getLastPage());
        if (page === this.getLastPage()) {
            const { data: nextJob } = await jobsApi().getJobs(page + 1, perPage, status || undefined);
            if (nextJob.length > 0) {
                cache.setLastPage(this.getPaginationName(), page + 1);
            }
        }
        return currentJob;
    },
    async createOne(jobId: string, job: CrupdateJob) {
        const { data } = await jobsApi().saveJob(jobId, job);
        return data;
    },
};
