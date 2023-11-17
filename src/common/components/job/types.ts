import { SvgIconComponent } from '@mui/icons-material';
import { Job } from 'bpartners-annotator-Ts-client';

export interface IJobListItem {
  job: Job;
  teamId: string;
}

export interface IJobStatusInfo {
  icon: SvgIconComponent;
  label: string;
  color: string;
}