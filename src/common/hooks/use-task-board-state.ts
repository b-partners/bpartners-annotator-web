import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IUseTaskBoardState } from '../../pages';
import { teamJobsProvider, userTasksProvider } from '../../providers';
import { userAnnotationsProvider } from '../../providers/annotator/user-annotations-provider';
import { getLastCreatedAnnotationBatch } from '../../router/loaders';
import { cache, retryer } from '../utils';
import { useFetch } from './use-fetch';

export const useTaskBoardState = (props: IUseTaskBoardState) => {
    const params = useParams();
    const { user } = cache.getWhoami();
    const [data, setState] = useState<IUseTaskBoardState>({ ...props });

    const navigate = useNavigate();

    const fetcher = async () => {
        const job = await retryer(teamJobsProvider.getOne(params?.teamId || '', params?.jobId || ''));
        if (!job || job.taskStatistics?.remainingTasksForUserId === 0) {
            navigate(`/teams/${params.teamId}/jobs`);
        }
        const task = await retryer(userTasksProvider.getOne(params?.jobId || '', params?.teamId || ''));
        if (!task) {
            navigate(`/teams/${params.teamId}/jobs`);
        }
        const annotationBatchs = await retryer(userAnnotationsProvider.getBatchs(user?.id || '', task?.id || ''));

        if (!task) return setState({ task: null, job, annotationBatch: null });

        const lastAnnotationBatch = getLastCreatedAnnotationBatch(annotationBatchs || []);

        setState({ task, job, annotationBatch: lastAnnotationBatch });
    };

    const { isLoading, fetcher: refetch } = useFetch({ fetcher });

    return { ...data, changeState: refetch, isLoading };
};
