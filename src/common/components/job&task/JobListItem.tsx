import { JobStatus } from '@bpartners-annotator/typescript-client';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Avatar, Chip, IconButton, ListItem, ListItemText, Stack } from '@mui/material';
import { blue } from '@mui/material/colors';
import { FC, createElement } from 'react';
import { Link } from 'react-router-dom';
import { IJobListItem, JOB_ITEM, getJobStatusInfo } from '.';
import { useListPageContext } from '../../context';
export const JobListItem: FC<IJobListItem> = ({ job, link }) => {
    const { icon, label, color } = getJobStatusInfo(job.status || JobStatus.PENDING);
    const { setLoading } = useListPageContext();

    return (
        <ListItem sx={JOB_ITEM} alignItems='flex-start'>
            <Stack>
                <Stack direction='row' className='job-title-container'>
                    <ListItemText primary={job.name || job.id} />
                    <Link to={link}>
                        <IconButton size='small' onClick={() => setLoading(true)}>
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
