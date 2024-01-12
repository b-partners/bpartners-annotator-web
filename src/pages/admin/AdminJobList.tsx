import { Job, JobStatus } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, CircularProgress, List, Typography } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { JobListItem } from '../../common/components/job&task';
import { ListPageLayout } from '../../common/components/layout';
import { Pagination } from '../../common/components/pagination';
import { useFetch } from '../../common/hooks';
import { jobsProvider } from '../../providers';
import { job_list_list_container } from '../style';

export const AdminJobList = () => {
    const fetcher = async ({ page, perPage, status }: any) => {
        return await jobsProvider.getList(page, perPage, status);
    };

    const { jobs, page, perPage, status } = useLoaderData() as {
        jobs: Job[];
        page: number;
        perPage: number;
        status: JobStatus;
    };

    const {
        data: currentJobs,
        isLoading,
        fetcher: jobsFetcher,
    } = useFetch({ fetcher, defaultData: jobs, defaultParams: { page, perPage, status } });

    const handlePaginationChange = (newPage: number, newPerPage?: number) => {
        jobsFetcher({
            page: newPage,
            perPage: newPerPage || perPage,
            status,
        });
    };

    return (
        <ListPageLayout actions={<Pagination onChange={handlePaginationChange} isLoading={isLoading} />}>
            {(currentJobs || []).length > 0 && !isLoading && (
                <List sx={job_list_list_container}>
                    {(currentJobs || []).map(job => (
                        <JobListItem link={`/jobs/${job.id}/tasks`} key={job.id} job={job} />
                    ))}
                </List>
            )}
            {(currentJobs || []).length === 0 && (
                <Box textAlign='center' sx={{ color: 'text.secondary' }}>
                    <InboxIcon sx={{ fontSize: '15rem' }} />
                    <Typography>Pas de jobs</Typography>
                </Box>
            )}
            {isLoading && (
                <Box textAlign='center' sx={{ color: 'text.secondary' }}>
                    <CircularProgress color='primary' />
                </Box>
            )}
        </ListPageLayout>
    );
};
