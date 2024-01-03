import { Job, Task } from '@bpartners-annotator/typescript-client';

export interface UseJobTaskState {
    task: Task | null;
    job: Job | null;
}
