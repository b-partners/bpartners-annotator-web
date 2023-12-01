import { Job } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, List, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { JobListItem } from '../../common/components/job&task';
import { job_list_list_container } from '../style';

export const AdminJobList = () => {
  const { jobs } = useLoaderData() as { jobs: Job[] };

  return (
    <>
      {jobs.length > 0 && (
        <List sx={job_list_list_container}>
          {jobs.map(job => (
            <JobListItem link={`/jobs/${job.id}/tasks`} key={job.id} job={job} />
          ))}
        </List>
      )}
      {jobs.length === 0 && (
        <Box textAlign='center' sx={{ color: 'text.secondary' }}>
          <InboxIcon sx={{ fontSize: '15rem' }} />
          <Typography>Pas de jobs</Typography>
        </Box>
      )}
    </>
  );
};