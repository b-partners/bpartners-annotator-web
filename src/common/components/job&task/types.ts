import { Job, Task } from '@bpartners-annotator/typescript-client';
import { SvgIconComponent } from '@mui/icons-material';

export interface IJobListItem {
  job: Job;
  link: string;
}

export interface ITaskListItem {
  task: Task;
}

export interface IJobStatusInfo {
  icon: SvgIconComponent;
  label: string;
  color: string;
}
