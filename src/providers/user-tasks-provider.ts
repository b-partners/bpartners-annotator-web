import { Annotation, UpdateTask } from 'bpartners-annotator-react-client';
import { userTasksApi } from '.';

export const userTasksProvider = {
  async getOne(jobId: string, teamId: string) {
    const { data } = await userTasksApi().getUserTaskByJob(teamId, jobId);
    return data;
  },
  async annotateOne(userId: string, taskId: string, taskAnnotation: Annotation[]) {
    const { data } = await userTasksApi().annotateTask(userId, taskId, taskAnnotation);
    return data;
  },
  async updateOne(teamId: string, jobId: string, taskId: string, resource: UpdateTask) {
    const { data } = await userTasksApi().updateTask(teamId, jobId, taskId, resource);
    return data;
  },
};
