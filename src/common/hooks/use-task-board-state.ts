import { AnnotationBatchReview, AnnotationReview } from '@bpartners-annotator/typescript-client';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUseTaskBoardState } from '../../pages';
import { teamJobsProvider, userTasksProvider } from '../../providers';
import { userAnnotationsProvider } from '../../providers/annotator/user-annotations-provider';
import { getLastCreatedAnnotationBatch, getUsableReviews } from '../../router/loaders';
import { cache, retryer } from '../utils';
import { useFetch } from './use-fetch';

export const useTaskBoardState = (props: IUseTaskBoardState) => {
    const params = useParams();
    const { user } = cache.getWhoami();
    const [data, setState] = useState<IUseTaskBoardState>({ ...props });

    const fetcher = async () => {
        const task = await retryer(userTasksProvider.getOne(params?.jobId || '', params?.teamId || ''));
        const job = await retryer(teamJobsProvider.getOne(params?.teamId || '', params?.jobId || ''));
        const annotationBatchs = await retryer(userAnnotationsProvider.getBatchs(user?.id || '', task?.id || ''));

        if (!task)
            return setState({ task: null, job, globalReviews: null, annotationsReviews: null, annotationBatch: null });

        const lastAnnotationBatch = getLastCreatedAnnotationBatch(annotationBatchs || []);
        let reviews: AnnotationBatchReview[] | null = null;
        let globalReviews: AnnotationReview[] = [];
        let annotationsReviews: AnnotationReview[] = [];

        if (!!lastAnnotationBatch) {
            // get all reviews that concern the last annotation batch
            reviews = await retryer(
                async () =>
                    await userAnnotationsProvider.getReviews(
                        user?.id || '',
                        task?.id || '',
                        lastAnnotationBatch?.id || ''
                    )
            );
            // separate reviews in two types
            // if it don't have an annotation id -> global
            // else -> annotations reviews
            const { annotationsReviews: ar, globalReviews: gr } = getUsableReviews(reviews);
            globalReviews = gr;
            annotationsReviews = ar;
        }
        setState({ task, job, annotationBatch: lastAnnotationBatch, globalReviews, annotationsReviews });
    };

    const { isLoading, fetcher: refetch } = useFetch(fetcher);

    return { ...data, changeState: refetch, isLoading };
};
