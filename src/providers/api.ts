import { JobsApi, TasksApi, TeamJobsApi, UserTasksApi } from 'bpartners-annotator-react-client';

export const jobsApi = () => new JobsApi();
export const tasksApi = () => new TasksApi();
export const teamJobsApi = () => new TeamJobsApi();
export const userTasksApi = () => new UserTasksApi();
