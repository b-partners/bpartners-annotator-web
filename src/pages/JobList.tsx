/* eslint-disable react-hooks/exhaustive-deps */
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, CircularProgress, List, Stack, TextField, Typography } from '@mui/material';
import debounce from 'debounce';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { JobListItem } from '../common/components/job&task';
import { ListPageLayout } from '../common/components/layout';
import { Pagination } from '../common/components/pagination';
import { useFetchJob } from '../common/fetchers';
import { cache, getUrlParams, urlParamsHandler } from '../common/utils';
import { teamJobsProvider } from '../providers';
import { job_list_list_container } from './style';

export const JobList = () => {
    const params = useParams();
    const { data: jobs, isLoading: fetchJobLoading, setFilters, refetch } = useFetchJob(params.teamId);

    const { setParam } = urlParamsHandler();
    const { teamId = '' } = useParams();

    useEffect(() => {
        cache.deleteCurrentTask();
    }, []);

    const handleSearch = useMemo(
        () =>
            debounce((e: ChangeEvent<HTMLInputElement>) => {
                setFilters({
                    name: e.target.value,
                } as any);
                refetch();
                setParam('q', e.target.value);
            }, 500),
        []
    );

    const handlePaginationChange = useCallback((newPage: number, newPerPage?: number) => {
        const { searchParams } = getUrlParams();
        setFilters({
            page: newPage,
            pageSize: newPerPage || +(searchParams.get('perPage') as string),
        });
        refetch();
    }, []);

    return (
        <ListPageLayout
            actions={
                <Stack direction='row' alignItems='center' width='100%'>
                    <Pagination
                        getLastPage={teamJobsProvider.getLastPage.bind(teamJobsProvider)}
                        onChange={handlePaginationChange}
                        isLoading={fetchJobLoading}
                    />
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
                {(jobs || []).length > 0 && !fetchJobLoading && (
                    <List sx={job_list_list_container}>
                        {(jobs || []).map(job => (
                            <JobListItem key={job.id} link={`/teams/${teamId}/jobs/${job.id}`} job={job} />
                        ))}
                    </List>
                )}
                {(jobs || []).length === 0 && !fetchJobLoading && (
                    <Box textAlign='center' sx={{ color: 'text.secondary', height: 500 }}>
                        <InboxIcon sx={{ fontSize: '15rem' }} />
                        <Typography>Pas de jobs</Typography>
                    </Box>
                )}
                {fetchJobLoading && (
                    <Box
                        textAlign='center'
                        sx={{
                            color: 'text.secondary',
                            height: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress color='primary' />
                    </Box>
                )}
            </div>
        </ListPageLayout>
    );
};
