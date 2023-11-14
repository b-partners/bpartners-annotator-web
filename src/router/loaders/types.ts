export interface JobsLoaderParams {
  teamId?: string;
}

export interface LoaderArgs<Params> {
  params: Params;
}

export type JobsLoaderArgs = LoaderArgs<JobsLoaderParams>;
