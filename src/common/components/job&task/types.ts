import { SvgIconComponent } from '@mui/icons-material';
import { Job, Task } from 'bpartners-annotator-Ts-client';

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
