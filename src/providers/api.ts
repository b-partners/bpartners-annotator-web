import {
    AdminApi,
    AnnotationsApi,
    JobsApi,
    SecurityApi,
    TasksApi,
    TeamJobsApi,
    TeamsApi,
    UserAnnotationsApi,
    UserTasksApi,
    UsersApi
} from '@bpartners-annotator/typescript-client';
import { authProvider } from './general';

// admin api
export const jobsApi = () => new JobsApi(authProvider.getAuthConf());
export const tasksApi = () => new TasksApi(authProvider.getAuthConf());
export const adminApi = () => new AdminApi(authProvider.getAuthConf());
export const usersApi = () => new UsersApi(authProvider.getAuthConf());
export const teamsApi = () => new TeamsApi(authProvider.getAuthConf());
export const annotationsApi = () => new AnnotationsApi(authProvider.getAuthConf());

// annotator api
export const teamJobsApi = () => new TeamJobsApi(authProvider.getAuthConf());
export const userTasksApi = () => new UserTasksApi(authProvider.getAuthConf());
export const userAnnotationsApi = () => new UserAnnotationsApi(authProvider.getAuthConf());

// general api
export const securityApi = () => new SecurityApi(authProvider.getAuthConf());
