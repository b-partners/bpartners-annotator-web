import { JobStatus } from '@bpartners-annotator/typescript-client';
import {
    AnalyticsOutlined as AnalyticsOutlinedIcon,
    Download as DownloadIcon,
    OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Avatar, Chip, IconButton, IconButtonProps, ListItem, ListItemText, Stack, Tooltip } from '@mui/material';
import { blue } from '@mui/material/colors';
import { FC, createElement } from 'react';
import { Link } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { IJobListItem, JOB_ITEM, getJobStatusInfo } from '.';
import { useListPageContext } from '../../context';
import { useSession } from '../../hooks';
import { stringCutter } from '../../utils';
import { palette } from '../../utils/theme';

const OpenListItemButton: FC<{ jobId: string; alreadyFinished: boolean } & Partial<IconButtonProps>> = ({
    jobId,
    alreadyFinished,
    ...iconButtonProps
}) => {
    const { setLoading } = useListPageContext();
    return (
        <IconButton
            size='small'
            data-cy={`job-item-${jobId}`}
            onClick={() => setLoading(!alreadyFinished)}
            {...iconButtonProps}
        >
            <OpenInNewIcon />
        </IconButton>
    );
};

export const JobListItem: FC<IJobListItem> = ({ job, link, onExportStatistics, onExport }) => {
    const { icon, label, color } = getJobStatusInfo(job.status || JobStatus.PENDING);
    const { isAdmin } = useSession();

    const isAlreadyFinished =
        (!job.taskStatistics?.remainingTasksForUserId || job.taskStatistics?.remainingTasksForUserId === 0) &&
        !isAdmin();

    const handleExport = () => {
        onExport && onExport(job.id || '');
    };

    const handleExportStatistics = () => {
        onExportStatistics && onExportStatistics(job.id || '');
    };

    return (
        <ListItem sx={JOB_ITEM} alignItems='flex-start'>
            <Stack>
                <Stack direction='row' className='job-title-container'>
                    <ListItemText
                        primary={
                            <Tooltip title={job.name || job.id || ''}>
                                <span>{stringCutter(job.name || job.id || '', 30)}</span>
                            </Tooltip>
                        }
                    />
                    {isAdmin() && (
                        <Tooltip title='Statistique' onClick={handleExportStatistics}>
                            <IconButton size='small' data-cy={`job-analytics-${job.id}`}>
                                <AnalyticsOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {isAdmin() &&
                        [JobStatus.COMPLETED, JobStatus.TO_REVIEW, JobStatus.TO_CORRECT].includes(
                            job.status as any
                        ) && (
                            <Tooltip title='Exporter'>
                                <IconButton size='small' data-cy={`job-export-${job.id}`} onClick={handleExport}>
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    {isAlreadyFinished ? (
                        <OpenListItemButton
                            alreadyFinished={isAlreadyFinished}
                            jobId={job.id!}
                            onClick={() => {
                                enqueueSnackbar('Les tâches restantes sont vides.', {
                                    style: { background: palette().success.main },
                                });
                            }}
                        />
                    ) : (
                        <Link to={link}>
                            <OpenListItemButton alreadyFinished={isAlreadyFinished} jobId={job.id!} />
                        </Link>
                    )}
                </Stack>
                <Stack direction='row' mt={2} spacing={1}>
                    <Chip
                        sx={{ outlineColor: color }}
                        avatar={
                            <Avatar>
                                {createElement(icon, { style: { fontSize: '1rem', background: `${color}90` } })}
                            </Avatar>
                        }
                        label={label}
                        size='small'
                        variant='outlined'
                    />
                    <Chip
                        avatar={<Avatar sx={{ background: blue[300] }}>{job.labels?.length}</Avatar>}
                        color='info'
                        label='Labelles'
                        size='small'
                        variant='outlined'
                    />
                    <Chip
                        color='warning'
                        label={`${job.taskStatistics?.remainingTasks}/${job.taskStatistics?.totalTasks} Taches restantes`}
                        size='small'
                        variant='outlined'
                    />
                </Stack>
            </Stack>
        </ListItem>
    );
};
