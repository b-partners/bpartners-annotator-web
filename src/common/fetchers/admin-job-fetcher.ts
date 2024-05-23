import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE, jobsProvider } from '../../providers';
import { JobStatus, JobType } from '@bpartners-annotator/typescript-client';

interface FetchAdminJobFilters {
    page?: number;
    perPage?: number;
    status?: JobStatus;
    name?: string;
    jobType?: JobType;
}

export const useFetchAdminJob = () => {
    const params = useParams();
    const [{ page, perPage, status, jobType, name }, setFilterState] = useState<FetchAdminJobFilters>({
        page: +(params.page || DEFAULT_PAGE),
        perPage: +(params.perPage || DEFAULT_PER_PAGE),
        status: params.status as JobStatus,
    });

    const adminJobQuery = useQuery({
        queryKey: ['admin', 'job', page, perPage, status],
        queryFn: () =>
            jobsProvider.getList(+(page || DEFAULT_PAGE), +(perPage || DEFAULT_PER_PAGE), status as any, name, jobType),
        refetchOnWindowFocus: false,
    });

    const setFilter = (filters: FetchAdminJobFilters) => {
        setFilterState(filters);
        adminJobQuery.refetch();
    };

    return {
        ...adminJobQuery,
        setFilter,
        page: +(page || DEFAULT_PAGE),
        perPage: +(perPage || DEFAULT_PER_PAGE),
        status,
        isLoading: adminJobQuery.isLoading || adminJobQuery.isFetching,
    };
};
