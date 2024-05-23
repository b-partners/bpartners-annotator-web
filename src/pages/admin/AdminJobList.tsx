/* eslint-disable react-hooks/exhaustive-deps */
import { JobStatus } from '@bpartners-annotator/typescript-client';
import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, CircularProgress, List, MenuItem, Stack, TextField, Typography } from '@mui/material';
import debounce from 'debounce';
import { ChangeEvent, useMemo } from 'react';
import { ExportJobDialog, ExportJobStatisticsDialog } from '../../common/components/admin';
import { JobListItem, getJobStatusInfo } from '../../common/components/job&task';
import { ListPageLayout } from '../../common/components/layout';
import { Pagination } from '../../common/components/pagination';
import { useDialog } from '../../common/context';
import { useFetchAdminJob } from '../../common/fetchers';
import { getUrlParams, urlParamsHandler } from '../../common/utils';
import { jobsProvider } from '../../providers';
import { job_list_list_container, job_list_loader } from '../style';

export const AdminJobList = () => {
    const { setParam } = urlParamsHandler();
    const { openDialog } = useDialog();

    const handleOpenExportJobDialog = (jobId: string) => openDialog(<ExportJobDialog jobId={jobId} />);
    const handleOpenExportJobStatisticsDialog = (jobId: string) =>
        openDialog(<ExportJobStatisticsDialog jobId={jobId} />);

    const { data: jobs, status, setFilter, isLoading } = useFetchAdminJob();

    const handlePaginationChange = (newPage: number, newPerPage?: number) => {
        const { searchParams } = getUrlParams();
        const status = searchParams.get('status') as JobStatus;

        setFilter({
            page: newPage,
            perPage: newPerPage || +(searchParams.get('perPage') as string),
            status,
        });
    };

    const handleSearch = useMemo(
        () =>
            debounce((e: ChangeEvent<HTMLInputElement>) => {
                setFilter({
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
        setFilter({
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
                    <Pagination
                        getLastPage={jobsProvider.getLastPage.bind(jobsProvider)}
                        onChange={handlePaginationChange}
                        isLoading={isLoading}
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
                        data-cy='job-list-input'
                    />
                </Box>
                {(jobs || []).length > 0 && !isLoading && (
                    <List sx={job_list_list_container}>
                        {(jobs || []).map(job => (
                            <JobListItem
                                onExport={handleOpenExportJobDialog}
                                onExportStatistics={handleOpenExportJobStatisticsDialog}
                                link={`/jobs/${job.id}/tasks/review`}
                                key={job.id}
                                job={job}
                            />
                        ))}
                    </List>
                )}
                {(jobs || []).length === 0 && !isLoading && (
                    <Box textAlign='center' sx={{ color: 'text.secondary', height: 500 }}>
                        <InboxIcon sx={{ fontSize: '15rem' }} />
                        <Typography>Pas de jobs</Typography>
                    </Box>
                )}
                {isLoading && (
                    <Box textAlign='center' sx={job_list_loader}>
                        <CircularProgress color='primary' />
                    </Box>
                )}
            </div>
        </ListPageLayout>
    );
};
