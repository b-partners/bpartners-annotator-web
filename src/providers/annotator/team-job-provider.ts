import { teamJobsApi } from '..';

export const teamJobsProvider = {
  async getOne(teamId: string, jobId: string) {
    const {data} = await teamJobsApi().getAnnotatorReadableTeamJobById(teamId, jobId);
    
    return data;
  },
  async getList(teamId: string) {
    const res = await teamJobsApi().getAnnotatorReadableTeamJobs(teamId);
    console.log(res);
    return res.data;
  },
};
