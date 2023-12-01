export interface JobsLoaderParams {
  teamId?: string;
}
export interface TaskLoaderParams {
  teamId?: string;
  jobId?: string;
}

export interface BatchLoaderParams {
  jobId?: string;
  taskId?: string;
}

export interface LoaderArgs<Params> {
  params: Params;
}

export type JobsLoaderArgs = LoaderArgs<JobsLoaderParams>;
export type TaskLoaderArgs = LoaderArgs<TaskLoaderParams>;
export type BatchLoaderArgs = LoaderArgs<BatchLoaderParams>;
