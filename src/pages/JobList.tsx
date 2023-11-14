import { Inbox as InboxIcon, NavigateBefore as NavigateBeforeIcon } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardHeader, List, Typography } from '@mui/material';
import { Job } from 'bpartners-annotator-react-client';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { JobListItem } from '../common/components/job';
import { job_list_card_action, job_list_card_content, job_list_container, job_list_list_container } from './style';

export const JobList = () => {
  const { jobs } = useLoaderData() as { jobs: Job[] };
  const { teamId } = useParams();

  console.log(jobs);

  return (
    <Box sx={job_list_container}>
      <Card>
        <CardHeader title='Liste des jobs' />
        <CardContent sx={job_list_card_content}>
          {jobs.length > 0 && (
            <List sx={job_list_list_container}>
              {jobs.map(job => (
                <JobListItem teamId={teamId || ''} key={job.id} job={job} />
              ))}
            </List>
          )}
          {jobs.length === 0 && (
            <Box textAlign='center' sx={{ color: 'text.secondary' }}>
              <InboxIcon sx={{ fontSize: '15rem' }} />
              <Typography>Pas de jobs</Typography>
            </Box>
          )}
        </CardContent>
        <CardActions sx={job_list_card_action}>
          <Link to='/'>
            <Button size='small' startIcon={<NavigateBeforeIcon />} variant='text'>
              Retour
            </Button>
          </Link>
        </CardActions>
      </Card>
    </Box>
  );
};
