import { AnnotationBatch, AnnotationBatchReview, AnnotationReview } from '@bpartners-annotator/typescript-client';
import { TaskLoaderArgs } from '.';
import { cache, retryer } from '../../common/utils';
import { teamJobsProvider, userTasksProvider } from '../../providers';
import { userAnnotationsProvider } from '../../providers/annotator/user-annotations-provider';

const getLastCreatedAnnotationBatch = (annotationBatchs: AnnotationBatch[]): AnnotationBatch | null => {
    if (annotationBatchs.length === 0) {
        return null;
    }

    return annotationBatchs.reduce((prev, current) => {
        const prevBatchDate = new Date(prev.creationDatetime || '');
        const currentBatchDate = new Date(current.creationDatetime || '');

        return prevBatchDate > currentBatchDate ? prev : current;
    });
};

const getUsableReviews = (reviews: AnnotationBatchReview[] | null) => {
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
    let reviews: AnnotationBatchReview[] | null = null;
    let globalReviews: AnnotationReview[] = [];
    let annotationsReviews: AnnotationReview[] = [];

    if (!!lastAnnotationBatch) {
        // get all reviews that concern the last annotation batch
        reviews = await retryer(
            async () =>
                await userAnnotationsProvider.getReviews(user?.id || '', task?.id || '', lastAnnotationBatch?.id || '')
        );
        // separate reviews in two types
        // if it don't have an annotation id -> global
        // else -> annotations reviews
        const { annotationsReviews: ar, globalReviews: gr } = getUsableReviews(reviews);
        globalReviews = gr;
        annotationsReviews = ar;
    }

    return { task, job, annotationBatch: lastAnnotationBatch, globalReviews, annotationsReviews };
};

export type UserTaskLoader<T = Awaited<ReturnType<typeof taskLoader>>> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};
