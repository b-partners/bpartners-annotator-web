import { teamJobsApi } from '..';
import { cache, paginationNameByDependencies } from '../../common/utils';

const USER_JOB_NAME = 'user-job';

export const teamJobsProvider = {
    getPaginationName: () => USER_JOB_NAME + paginationNameByDependencies(['perPage', 'q']),
    getLastPage() {
        return cache.getLastPage(this.getPaginationName());
    },
    async getOne(teamId: string, jobId: string) {
        const { data } = await teamJobsApi().getAnnotatorReadableTeamJobById(teamId, jobId);
        return data;
    },
    async getList(teamId: string, page?: number, pageSize?: number, name?: string) {
        const { data } = await teamJobsApi().getAnnotatorReadableTeamJobs(teamId, page, pageSize, name);
        console.log(this.getLastPage());
        if (page === this.getLastPage()) {
            const { data: nextJob } = await teamJobsApi().getAnnotatorReadableTeamJobs(
                teamId,
                page + 1,
                pageSize,
                name
            );
            if (nextJob.length > 0) {
                cache.setLastPage(this.getPaginationName(), page + 1);
            }
        }
        return data;
    },
};
