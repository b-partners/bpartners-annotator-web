import { Job } from "@bpartners-annotator/typescript-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { DEFAULT_PER_PAGE, teamJobsProvider } from "../../providers";

interface FilterState {
    page?: number;
    pageSize?: number;
    name?: string;
}

export const useFetchJob = (teamId: string) => {
    const [state, setState] = useState<FilterState>({ page: DEFAULT_PER_PAGE, pageSize: DEFAULT_PER_PAGE });
    const { name, page, pageSize } = state;
    const query = useQuery<Job[], AxiosError>({
        queryKey: ['job', page, pageSize, name],
        queryFn: () => teamJobsProvider.getList(teamId, page, pageSize, name),
        select: jobs =>
            jobs.filter(
                job => !!job.taskStatistics?.remainingTasksForUserId && job.taskStatistics?.remainingTasksForUserId > 0
            ),
    });

    return { ...query, filters: state, setFilters: setState };
};