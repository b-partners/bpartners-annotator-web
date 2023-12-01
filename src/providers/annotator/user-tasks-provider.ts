import { Annotation, UpdateTask } from '@bpartners-annotator/typescript-client';
import { userTasksApi } from '..';
import { cache } from '../../common/utils';

export const userTasksProvider = {
  async getOne(jobId: string, teamId: string) {
    const currentTask = cache.getCurrentTask();
    if (!!currentTask) return currentTask;
    const { data } = await userTasksApi().getUserTaskByJob(teamId, jobId);
    cache.setCurrentTask(data);
    return data;
  },
  async annotateOne(userId: string, taskId: string, taskAnnotation: Annotation[]) {
    const { data } = await userTasksApi().annotateTask(userId, taskId, taskAnnotation as any);
    return data;
  },
  async updateOne(teamId: string, jobId: string, taskId: string, resource: UpdateTask) {
    const { data } = await userTasksApi().updateTask(teamId, jobId, taskId, resource);
    cache.deleteCurrentTask();
    return data;
  },
};
