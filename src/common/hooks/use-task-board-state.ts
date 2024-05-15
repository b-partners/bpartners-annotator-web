import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { teamJobsProvider, userTasksProvider } from '../../providers';
import { userAnnotationsProvider } from '../../providers/annotator/user-annotations-provider';
import { UserTaskLoader } from '../../router/loaders';
import { cache, retryer } from '../utils';
import { useFetch } from './use-fetch';

type UseTaskBoardFetchState = {
    [K in keyof Pick<UserTaskLoader, 'annotationBatchs' | 'job' | 'task'>]: UserTaskLoader[K] | null;
};

export const useTaskBoardState = () => {
    const { job, task, annotationBatchs } = useLoaderData() as UserTaskLoader;

    const params = useParams();
    const { user } = cache.getWhoami();

    const navigate = useNavigate();

    const fetcher = async (): Promise<UseTaskBoardFetchState> => {
        const job = await retryer(teamJobsProvider.getOne(params?.teamId || '', params?.jobId || ''));
        if (!job || job.taskStatistics?.remainingTasksForUserId === 0) {
            navigate(`/teams/${params.teamId}/jobs`);
        }
        const task = await retryer(userTasksProvider.getOne(params?.jobId || '', params?.teamId || ''));
        if (!task) {
            navigate(`/teams/${params.teamId}/jobs`);
        }
        const annotationBatchs =
            (await retryer(userAnnotationsProvider.getBatchs(user?.id || '', task?.id || ''))) || [];

        if (!task) return { task: null, job, annotationBatchs };

        return {
            task,
            job,
            annotationBatchs,
        };
    };

    const {
        isLoading,
        fetcher: refetch,
        data: fetchResult = { annotationBatchs: [], job: null, task: null },
    } = useFetch<UseTaskBoardFetchState>({ fetcher, defaultData: { job, task, annotationBatchs } });

    return { changeState: refetch, isLoading, ...fetchResult };
};
