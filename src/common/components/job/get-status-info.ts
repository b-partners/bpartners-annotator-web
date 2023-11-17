import {
  CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
  FlagCircleOutlined as FlagCircleOutlinedIcon,
  PendingActionsOutlined as PendingActionsOutlinedIcon,
  PlayCircleOutlineOutlined as PlayCircleOutlineOutlinedIcon,
} from '@mui/icons-material';
import { JobStatus } from 'bpartners-annotator-Ts-client';
import { IJobStatusInfo } from '.';

export const getJobStatusInfo = (status: JobStatus): IJobStatusInfo => {
  switch (status) {
    case 'PENDING':
      return { icon: PendingActionsOutlinedIcon, label: 'En attente', color: '#A9A9A9' };
    case 'READY':
      return { icon: FlagCircleOutlinedIcon, label: 'Prêt', color: '#4CAF50' };
    case 'STARTED':
      return { icon: PlayCircleOutlineOutlinedIcon, label: 'Encours', color: '#FFA500' };
    case 'FAILED':
      return { icon: ErrorOutlineOutlinedIcon, label: 'Échoué', color: '#FF0000' };
    default:
      return { icon: CheckCircleOutlineOutlinedIcon, label: 'Terminé', color: '#00FF00' };
  }
};
