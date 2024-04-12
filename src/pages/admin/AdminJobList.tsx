/* eslint-disable react-hooks/exhaustive-deps */
import { Job, JobStatus } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, CircularProgress, List, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useCallback, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { JobListItem, getJobStatusInfo } from '../../common/components/job&task';
import { ListPageLayout } from '../../common/components/layout';
import { Pagination } from '../../common/components/pagination';
import { useFetch } from '../../common/hooks';
import { getUrlParams, urlParamsHandler } from '../../common/utils';
import { jobsProvider } from '../../providers';
import { job_list_list_container } from '../style';
import { useDialog } from '../../common/context';
import { ExportJobDialog } from '../../common/components/admin';
import debounce from 'debounce';

export const AdminJobList = () => {
    const { setParam } = urlParamsHandler();
    const { openDialog } = useDialog();

    const handleOpenDialog = (jobId: string) => openDialog(<ExportJobDialog jobId={jobId} />);

    const fetcher = useCallback(async ({ page, perPage, status, name, type }: any) => {
        return await jobsProvider.getList(page, perPage, status, name, type);
    }, []);

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
    } = useFetch({ fetcher, defaultData: jobs, defaultParams: { page, perPage, status }, onlyOnMutate: true });

    const handlePaginationChange = (newPage: number, newPerPage?: number) => {
        const { searchParams } = getUrlParams();
        const status = searchParams.get('status') as JobStatus;

        jobsFetcher({
            page: newPage,
            perPage: newPerPage || +(searchParams.get('perPage') as string),
            status,
        });
    };

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

    const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
        let value: any = e.target.value;
        if (value.length === 0) value = undefined;
        const { searchParams } = getUrlParams();
        jobsFetcher({
            page: 1,
            perPage: +(searchParams.get('perPage') as string),
            status: value,
        });
        setParam('status', value);
        setParam('page', '1');
    };

    return (
        <ListPageLayout
            actions={
                <Stack direction='row' alignItems='center' width='100%'>
                    <Box flexGrow={1}>
                        <TextField
                            disabled={isLoading}
                            sx={{ width: '8rem' }}
                            label='Statut'
                            value={status}
                            onChange={handleChangeStatus}
                            size='small'
                            select
                        >
                            {[...Object.keys(JobStatus), ''].map(key => {
                                const { label } = getJobStatusInfo(key as JobStatus);
                                return (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Box>
                    <Pagination getLastPage={jobsProvider.getLastPage.bind(jobsProvider)} onChange={handlePaginationChange} isLoading={isLoading} />
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
                            <JobListItem
                                onExport={handleOpenDialog}
                                link={`/jobs/${job.id}/tasks/review`}
                                key={job.id}
                                job={job}
                            />
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
