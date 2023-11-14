import { Configuration, JobsApi, TasksApi, TeamJobsApi, UserTasksApi } from 'bpartners-annotator-react-client';

export const jobsApi = () => new JobsApi(new Configuration());
export const tasksApi = () => new TasksApi(new Configuration());
export const teamJobsApi = () => new TeamJobsApi(new Configuration());
export const userTasksApi = () => new UserTasksApi(new Configuration());
