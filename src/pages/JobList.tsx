/* eslint-disable react-hooks/exhaustive-deps */
import { Job } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, CircularProgress, List, Stack, TextField, Typography } from '@mui/material';
import debounce from 'debounce';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { JobListItem } from '../common/components/job&task';
import { ListPageLayout } from '../common/components/layout';
import { Pagination } from '../common/components/pagination';
import { useFetch } from '../common/hooks';
import { cache, getUrlParams, urlParamsHandler } from '../common/utils';
import { teamJobsProvider } from '../providers';
import { job_list_list_container } from './style';

export const JobList = () => {
    const { setParam } = urlParamsHandler();
    const { jobs } = useLoaderData() as { jobs: Job[] };
    const { teamId = '' } = useParams();
    const fetcher = ({ page, perPage, name }: any) => teamJobsProvider.getList(teamId || '', page, perPage, name);

    const {
        data: currentJobs,
        isLoading,
        fetcher: jobsFetcher,
    } = useFetch({ fetcher, defaultData: jobs, defaultParams: { teamId }, onlyOnMutate: true });

    useEffect(() => {
        cache.deleteCurrentTask();
    }, []);

    const handleSearch = useMemo(
        () =>
            debounce((e: ChangeEvent<HTMLInputElement>) => {
                jobsFetcher({
                    name: e.target.value,
                } as any);
                setParam('q', e.target.value);
            }, 500),
        []
    );

    const handlePaginationChange = (newPage: number, newPerPage?: number) => {
        const { searchParams } = getUrlParams();
        jobsFetcher({
            page: newPage,
            perPage: newPerPage || +(searchParams.get('perPage') as string),
        });
    };

    return (
        <ListPageLayout
            actions={
                <Stack direction='row' alignItems='center' width='100%'>
                    <Pagination onChange={handlePaginationChange} isLoading={isLoading} />
                </Stack>
            }
        >
            <div>
                <Box width={400}>
                    <TextField
                        type='text'
                        size='small'
                        onChange={handleSearch}
                        placeholder='Rechercher'
                        sx={{ mx: 1, my: 1 }}
                        fullWidth
                    />
                </Box>
                {(currentJobs || []).length > 0 && !isLoading && (
                    <List sx={job_list_list_container}>
                        {(currentJobs || []).map(job => (
                            <JobListItem key={job.id} link={`/teams/${teamId}/jobs/${job.id}`} job={job} />
                        ))}
                    </List>
                )}
                {(currentJobs || []).length === 0 && !isLoading && (
                    <Box textAlign='center' sx={{ color: 'text.secondary', height: 500 }}>
                        <InboxIcon sx={{ fontSize: '15rem' }} />
                        <Typography>Pas de jobs</Typography>
                    </Box>
                )}
                {isLoading && (
                    <Box textAlign='center' sx={{ color: 'text.secondary', height: 500 }}>
                        <CircularProgress color='primary' />
                    </Box>
                )}
            </div>
        </ListPageLayout>
    );
};
