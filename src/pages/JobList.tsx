import { Job } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { JobListItem } from '../common/components/job&task';
import { cache } from '../common/utils';
import { job_list_list_container } from './style';

export const JobList = () => {
  const { jobs } = useLoaderData() as { jobs: Job[] };
  const { teamId } = useParams();

  useEffect(() => {
    cache.deleteCurrentTask();
  }, []);

  return (
    <>
      {jobs.length > 0 && (
        <List sx={job_list_list_container}>
          {jobs.map(job => (
            <JobListItem key={job.id} link={`/teams/${teamId}/jobs/${job.id}`} job={job} />
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
