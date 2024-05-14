import { AnnotationBatch, AnnotationBatchReview } from '@bpartners-annotator/typescript-client';
import { TaskLoaderArgs } from '.';
import { cache, retryer } from '../../common/utils';
import { teamJobsProvider, userTasksProvider } from '../../providers';
import { userAnnotationsProvider } from '../../providers/annotator/user-annotations-provider';

export const getLastCreatedAnnotationBatch = (annotationBatchs: AnnotationBatch[]): AnnotationBatch | null => {
    if (annotationBatchs.length === 0) {
        return null;
    }

    return annotationBatchs.reduce((prev, current) => {
        const prevBatchDate = new Date(prev.creationDatetime || '');
        const currentBatchDate = new Date(current.creationDatetime || '');

        return prevBatchDate > currentBatchDate ? prev : current;
    });
};

export const getUsableReviews = (reviews: AnnotationBatchReview[] | null) => {
    const globalReviews = [];
    const annotationsReviews = [];
    if (!!reviews && reviews.length > 0) {
        const last = reviews.length - 1;
        for (let a of reviews[last].reviews || []) {
            if (!a.annotationId) {
                globalReviews.push(a);
            } else {
                annotationsReviews.push(a);
            }
        }
    }
    return { globalReviews, annotationsReviews };
};

export const taskLoader = async ({ params }: TaskLoaderArgs) => {
    const { user } = cache.getWhoami();
    const taskPromise = retryer(async () => await userTasksProvider.getOne(params?.jobId || '', params?.teamId || ''));
    const jobPromise = retryer(async () => await teamJobsProvider.getOne(params?.teamId || '', params?.jobId || ''));

    const [task, job] = await Promise.all([taskPromise, jobPromise]);

    if (!task) {
        return { task: null, job, annotationBatch: null, globalReviews: null, annotationsReviews: null };
    }

    const annotationBatchs = await retryer(
        async () => await userAnnotationsProvider.getBatchs(user?.id || '', task?.id || '')
    );
    const lastAnnotationBatch = getLastCreatedAnnotationBatch(annotationBatchs || []);

    return {
        task,
        job,
        annotationBatch: lastAnnotationBatch,
        annotationBatchs: annotationBatchs || [],
    };
};

export type UserTaskLoader<T = Awaited<ReturnType<typeof taskLoader>>> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};
