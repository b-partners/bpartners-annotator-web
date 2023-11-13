import { tasksApi } from '.';

export const tasksProvider = {
  async getOne(jobId: string, taskId: string) {
    const { data } = await tasksApi().getJobTaskById(jobId, taskId);
    return data;
  },
  async getList(jobId: string) {
    const { data } = await tasksApi().getJobTasks(jobId);
    return data;
  },
};
