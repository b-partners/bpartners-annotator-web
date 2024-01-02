import { JobStatus, TaskStatus } from '@bpartners-annotator/typescript-client';
import {
    CheckCircleOutlineOutlined as CheckCircleOutlineOutlinedIcon,
    ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
    FlagCircleOutlined as FlagCircleOutlinedIcon,
    PendingActionsOutlined as PendingActionsOutlinedIcon,
    PlayCircleOutlineOutlined as PlayCircleOutlineOutlinedIcon,
} from '@mui/icons-material';
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

export const getTaskStatusInfo = (status: TaskStatus) => {
    switch (status) {
        case TaskStatus.COMPLETED:
            return { icon: CheckCircleOutlineOutlinedIcon, label: 'Terminé', color: '#00FF00' };
        case TaskStatus.PENDING:
            return { icon: PendingActionsOutlinedIcon, label: 'En attente', color: '#A9A9A9' };
        default:
            return { icon: PlayCircleOutlineOutlinedIcon, label: 'Encours', color: '#FFA500' };
    }
};
