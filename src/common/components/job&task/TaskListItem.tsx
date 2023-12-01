import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Avatar, Chip, IconButton, Link, ListItem, ListItemText, Stack } from '@mui/material';
import { TaskStatus } from 'bpartners-annotator-Ts-client';
import { FC, createElement } from 'react';
import { useParams } from 'react-router-dom';
import { ITaskListItem, JOB_ITEM, getTaskStatusInfo } from '.';

export const TaskListItem: FC<ITaskListItem> = ({ task }) => {
  const params = useParams() as { jobId: string };
  const link = `/jobs/${params.jobId}/tasks/${task.id}`;
  const { color, icon, label } = getTaskStatusInfo(task.status || TaskStatus.PENDING);

  return (
    <ListItem sx={JOB_ITEM} alignItems='flex-start'>
      <Stack>
        <Stack direction='row' className='job-title-container'>
          <ListItemText primary={task.id} />
          <Link href={link}>
            <IconButton size='small'>
              <OpenInNewIcon />
            </IconButton>
          </Link>
        </Stack>
        <Stack direction='row' mt={2} spacing={1}>
          <Stack direction='row' mt={2} spacing={1}>
            <Chip
              sx={{ outlineColor: color }}
              avatar={<Avatar>{createElement(icon, { style: { fontSize: '1rem', background: `${color}90` } })}</Avatar>}
              label={label}
              size='small'
              variant='outlined'
            />
          </Stack>
        </Stack>
      </Stack>
    </ListItem>
  );
};
