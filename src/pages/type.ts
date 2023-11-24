import { Job, Task } from 'bpartners-annotator-Ts-client';

export interface UseJobTaskState {
  task: Task | null;
  job: Job | null;
}
