import { AnnotationBatchReview } from '@bpartners-annotator/typescript-client';
import { annotationsApi, MAX_PER_PAGE } from '..';

export const annotationsProvider = {
    async updateReview(
        jobId: string,
        taskId: string,
        annotationBatchId: string,
        reviewId: string,
        annotationBatchReview: AnnotationBatchReview
    ) {
        const { data } = await annotationsApi().crupdateJobTaskAnnotationReview(
            jobId,
            taskId,
            annotationBatchId,
            reviewId,
            annotationBatchReview
        );
        return data;
    },
    async getBatch(jobId: string, taskId: string, annotationBatchId: string) {
        const { data } = await annotationsApi().getAnnotationBatchByJobTaskAndId(jobId, taskId, annotationBatchId);
        return data;
    },
    async getBatchs(jobId: string, taskId: string, page = 1, pageSize = MAX_PER_PAGE) {
        const { data } = await annotationsApi().getAnnotationBatchesByJobTask(jobId, taskId, page, pageSize);
        return data;
    },
    async getBatchReview(jobId: string, taskId: string, annotationBatchId: string, reviewId: string) {
        const { data } = await annotationsApi().getJobTaskAnnotationBatchReview(
            jobId,
            taskId,
            annotationBatchId,
            reviewId
        );
        return data;
    },
    async getBatchReviews(jobId: string, taskId: string, annotationBatchId: string) {
        const { data } = await annotationsApi().getJobTaskAnnotationBatchReviews(jobId, taskId, annotationBatchId);
        return data;
    },
};
