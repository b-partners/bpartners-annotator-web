import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Avatar, Chip, IconButton, Link, ListItem, ListItemText, Stack } from '@mui/material';
import { blue } from '@mui/material/colors';
import { JobStatus } from 'bpartners-annotator-Ts-client';
import { FC, createElement } from 'react';
import { IJobListItem, JOB_ITEM, getJobStatusInfo } from '.';
export const JobListItem: FC<IJobListItem> = ({ job, teamId }) => {
  const { icon, label, color } = getJobStatusInfo(job.status || JobStatus.PENDING);

  const link = `/teams/${teamId}/jobs/${job.id}`;

  return (
    <ListItem sx={JOB_ITEM} alignItems='flex-start'>
      <Stack>
        <Stack direction='row' className='job-title-container'>
          <ListItemText primary={job.name || job.id} />
          <Link href={link}>
            <IconButton size='small'>
              <OpenInNewIcon />
            </IconButton>
          </Link>
        </Stack>
        <Stack direction='row' mt={2} spacing={1}>
          <Chip
            sx={{ outlineColor: color }}
            avatar={<Avatar>{createElement(icon, { style: { fontSize: '1rem', background: `${color}90` } })}</Avatar>}
            label={label}
            size='small'
            variant='outlined'
          />
          <Chip avatar={<Avatar sx={{ background: blue[300] }}>{job.labels?.length}</Avatar>} color='info' label='Labelles' size='small' variant='outlined' />
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
