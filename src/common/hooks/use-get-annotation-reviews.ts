import { AnnotationBatchReview } from '@bpartners-annotator/typescript-client';
import { userAnnotationsProvider } from '../../providers';
import { cache, retryer } from '../utils';
import { useFetch } from './use-fetch';

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

interface FetcherParams {
    annotationBatchId: string;
    taskId: string;
    page?: number;
    perPage?: number;
}

const defaultAnnotationReview = {
    globalReviews: [],
    annotationsReviews: [],
};

export const useGetAnnotationReviews = () => {
    const { user } = cache.getWhoami();

    const fetcher = async (params?: FetcherParams | undefined) => {
        if (!params) return defaultAnnotationReview;
        const { annotationBatchId, taskId } = params;
        const data = await retryer(userAnnotationsProvider.getReviews(user?.id || '', taskId, annotationBatchId));
        return getUsableReviews(data);
    };

    const {
        data,
        fetcher: fetchAnnotationReviews,
        ...others
    } = useFetch<ReturnType<typeof getUsableReviews>, FetcherParams>({
        fetcher,
        onlyOnMutate: true,
    });

    return {
        annotationReviews: data || defaultAnnotationReview,
        fetchAnnotationReviews,
        ...others,
    };
};
