import { teamJobsApi } from '..';

export const teamJobsProvider = {
    async getOne(teamId: string, jobId: string) {
        const { data } = await teamJobsApi().getAnnotatorReadableTeamJobById(teamId, jobId);

        return data;
    },
    async getList(teamId: string, page?: number, pageSize?: number, name?: string) {
        const res = await teamJobsApi().getAnnotatorReadableTeamJobs(teamId, page, pageSize, name);
        return res.data;
    },
};
