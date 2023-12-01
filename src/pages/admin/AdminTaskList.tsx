import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, List, Typography } from '@mui/material';
import { Task } from 'bpartners-annotator-Ts-client';
import { useLoaderData } from 'react-router-dom';
import { TaskListItem } from '../../common/components/job&task';
import { job_list_list_container } from '../style';

export const AdminTaskList = () => {
  const { tasks } = useLoaderData() as { tasks: Task[] };

  return (
    <>
      {tasks.length > 0 && <List sx={job_list_list_container}>{tasks.length > 0 && tasks.map(task => <TaskListItem key={task.id} task={task} />)}</List>}
      {tasks.length === 0 && (
        <Box textAlign='center' sx={{ color: 'text.secondary' }}>
          <InboxIcon sx={{ fontSize: '15rem' }} />
          <Typography>Pas de tâches</Typography>
        </Box>
      )}
    </>
  );
};
