import { useMutation, useQueries } from '@tanstack/react-query';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { teamJobsProvider, userAnnotationsProvider, userTasksProvider } from '../../providers';
import { cache } from '../utils';

const jobFetcherFn = async (teamId: string, jobId: string, navigate: NavigateFunction) => {
    const job = await teamJobsProvider.getOne(teamId, jobId);
    if (!job || job.taskStatistics?.remainingTasksForUserId === 0) navigate(`/teams/${teamId}/jobs`);
    return job;
};

const taskFetcherFn = async (
    teamId: string,
    jobId: string,
    navigate: NavigateFunction,
    onDone: ({ taskId }: Record<'taskId', string>) => void
) => {
    const task = await userTasksProvider.getOne(jobId, teamId);
    if (!task) {
        navigate(`/teams/${teamId}/jobs`);
    }
    onDone({ taskId: task.id ?? '' });
    return task;
};

const annotationBatchsFetcherFn = async (taskId: string) => {
    const { user } = cache.getWhoami();
    return await userAnnotationsProvider.getBatchs(user?.id ?? '', taskId);
};

export const useTaskBoardFetcher = () => {
    const { teamId = '', jobId = '' } = useParams();

    const navigate = useNavigate();

    const annotationBatchMutation = useMutation({
        mutationKey: ['taskBoard', 'job', teamId],
        mutationFn: ({ taskId }: Record<'taskId', string>) => annotationBatchsFetcherFn(taskId),
    });

    const [jobQuery, taskQuery] = useQueries({
        queries: [
            {
                queryKey: ['taskBoard', 'job', teamId, jobId],
                queryFn: () => jobFetcherFn(teamId, jobId, navigate),
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            },
            {
                queryKey: ['taskBoard', 'task', teamId, jobId],
                queryFn: () => taskFetcherFn(teamId, jobId, navigate, annotationBatchMutation.mutate),
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            },
        ],
    });

    return {
        job: jobQuery.data,
        task: taskQuery.data,
        annotationBatchs: annotationBatchMutation.data,
        isLoading:
            jobQuery.isLoading ||
            jobQuery.isFetching ||
            taskQuery.isLoading ||
            taskQuery.isFetching ||
            annotationBatchMutation.isPending,
        changeState: () => {
            jobQuery.refetch();
            taskQuery.refetch();
        },
    };
};
