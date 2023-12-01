import { TaskStatus } from '@bpartners-annotator/typescript-client';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Avatar, Chip, IconButton, ListItem, ListItemText, Stack } from '@mui/material';
import { FC, createElement } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ITaskListItem, JOB_ITEM, getTaskStatusInfo } from '.';
import { useListPageContext } from '../../context';

export const TaskListItem: FC<ITaskListItem> = ({ task }) => {
  const params = useParams() as { jobId: string };
  const link = `/jobs/${params.jobId}/tasks/${task.id}/review`;
  const { color, icon, label } = getTaskStatusInfo(task.status || TaskStatus.PENDING);
  const { setLoading } = useListPageContext();

  return (
    <ListItem sx={JOB_ITEM} alignItems='flex-start'>
      <Stack>
        <Stack direction='row' className='job-title-container'>
          <ListItemText primary={task.id} />
          <Link to={link}>
            <IconButton size='small' onClick={() => setLoading(true)}>
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
