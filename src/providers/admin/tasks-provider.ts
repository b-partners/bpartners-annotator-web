import { tasksApi } from '..';

export const tasksProvider = {
    async getOne(jobId: string, taskId: string) {
        const { data } = await tasksApi().getJobTaskById(jobId, taskId);
        return data;
    },
    async getList(jobId: string) {
        const { data } = await tasksApi().getJobTasks(jobId, 1, 500, 'TO_REVIEW' as any);
        return data;
    }
};
