import { JobsApi, TasksApi, TeamJobsApi, UserTasksApi } from 'bpartners-annotator-Ts-client';
import { authProvider } from '.';

export const jobsApi = () => new JobsApi(authProvider.getAuthConf());
export const tasksApi = () => new TasksApi(authProvider.getAuthConf());
export const teamJobsApi = () => new TeamJobsApi(authProvider.getAuthConf());
export const userTasksApi = () => new UserTasksApi(authProvider.getAuthConf());
