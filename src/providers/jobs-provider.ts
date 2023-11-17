import { CrupdateJob } from 'bpartners-annotator-Ts-client';
import { jobsApi } from '.';

export const jobsProvider = {
  async getOne(jobId: string) {
    const { data } = await jobsApi().getJob(jobId);
    return data;
  },
  async getList() {
    const { data } = await jobsApi().getJobs();
    return data;
  },
  async createOne(jobId: string, job: CrupdateJob) {
    const { data } = await jobsApi().saveJob(jobId, job);
    return data;
  },
};
