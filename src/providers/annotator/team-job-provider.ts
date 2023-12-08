import { teamJobsApi } from '..';

export const teamJobsProvider = {
  async getOne(teamId: string, jobId: string) {
    const { data } = await teamJobsApi().getAnnotatorReadableTeamJobById(teamId, jobId);
    return data;
  },
  async getList(teamId: string) {
    const { data } = await teamJobsApi().getAnnotatorReadableTeamJobs(teamId);
    return data;
  },
};
