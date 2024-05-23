/* eslint-disable react-hooks/exhaustive-deps */
import { AnnotationBatch, Task } from '@bpartners-annotator/typescript-client';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EMPTY_ANNOTATIONS_TO_VALIDATE, jobsProvider, tasksProvider } from '../../providers';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { getTaskToValidate, urlParamsHandler } from '../utils';
import debounce from 'debounce';
import { enqueueSnackbar } from 'notistack';
import { palette } from '../utils/theme';

interface AdminBatchsMutationParams {
    taskId: string;
}

const adminBatchsMutationFn = async (jobId: string, taskId: string) => {
    const { setParam } = urlParamsHandler();
    const batchs = await annotationsProvider.getBatchs(jobId, taskId);
    setParam('taskId', taskId || '');
    return batchs;
};

export const useAdminTaskFetcher = () => {
    const { jobId = '' } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState<AnnotationBatch | null>(null);

    const notify = useMemo(
        () =>
            debounce(
                () =>
                    enqueueSnackbar("Il n'y a pas encore d'annotation à valider dans ce job.", {
                        style: { background: palette().info.dark },
                    }),
                100
            ),
        [enqueueSnackbar]
    );

    const adminBatchsMutation = useMutation({
        mutationKey: ['admin', 'batchs', 'board', jobId],
        mutationFn: async ({ taskId }: AdminBatchsMutationParams) => {
            const batchs = await adminBatchsMutationFn(jobId, taskId);
            batchs.length > 0 && setBatch(batchs[0]);
            return batchs;
        },
    });

    const [adminTaskFetcher, adminJobFetcher] = useQueries({
        queries: [
            {
                queryKey: ['admin', 'task', 'board', jobId],
                queryFn: () => tasksProvider.getList(jobId),
                select: (tasks: Task[]) => ({
                    tasks,
                    task: getTaskToValidate(tasks || []),
                }),
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            },
            {
                queryKey: ['admin', 'job', 'board', jobId],
                queryFn: () => jobsProvider.getOne(jobId),
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            },
        ],
    });

    const task = adminTaskFetcher.data?.task;

    useEffect(() => {
        const taskId = task?.id;
        const { isLoading, isFetching } = adminTaskFetcher;
        if (!taskId && !isLoading && !isFetching) {
            navigate(`/jobs?${EMPTY_ANNOTATIONS_TO_VALIDATE}=true`);
            notify();
            return () => {};
        }
        taskId && adminBatchsMutation.mutate({ taskId });
    }, [task]);

    return {
        task,
        tasks: adminTaskFetcher.data?.tasks,
        batchs: adminBatchsMutation.data,
        job: adminJobFetcher.data,
        batch,
        refetch: adminTaskFetcher.refetch,
        setBatch,
        isLoading:
            adminTaskFetcher.isLoading ||
            adminTaskFetcher.isFetching ||
            adminBatchsMutation.isPending ||
            adminJobFetcher.isLoading ||
            adminJobFetcher.isFetching,
    };
};
