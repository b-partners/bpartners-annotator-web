import { JobStatus } from '@bpartners-annotator/typescript-client';
import {
    AnalyticsOutlined as AnalyticsOutlinedIcon,
    Download as DownloadIcon,
    OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { Avatar, Chip, IconButton, ListItem, ListItemText, Stack, Tooltip } from '@mui/material';
import { blue } from '@mui/material/colors';
import { FC, createElement } from 'react';
import { Link } from 'react-router-dom';
import { IJobListItem, JOB_ITEM, getJobStatusInfo } from '.';
import { useListPageContext } from '../../context';
import { useSession } from '../../hooks';
import { stringCutter } from '../../utils';
export const JobListItem: FC<IJobListItem> = ({ job, link, onExport }) => {
    const { icon, label, color } = getJobStatusInfo(job.status || JobStatus.PENDING);
    const { setLoading } = useListPageContext();
    const { isAdmin } = useSession();

    const handleExport = () => {
        onExport && onExport(job.id || '');
    };

    const statisticsLink = `/jobs/${job.id}/statistics`;

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
                        <Link to={statisticsLink}>
                            <Tooltip title='Statistique'>
                                <IconButton size='small' data-cy={`job-analytics-${job.id}`}>
                                    <AnalyticsOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Link>
                    )}
                    {isAdmin() && [JobStatus.COMPLETED, JobStatus.TO_REVIEW].includes(job.status as JobStatus) && (
                        <Tooltip title='Exporter'>
                            <IconButton size='small' data-cy={`job-export-${job.id}`} onClick={handleExport}>
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Link to={link}>
                        <IconButton size='small' data-cy={`job-item-${job.id}`} onClick={() => setLoading(true)}>
                            <OpenInNewIcon />
                        </IconButton>
                    </Link>
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
