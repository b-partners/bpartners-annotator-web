import { AnnotationBatch } from '@bpartners-annotator/typescript-client';
import { userAnnotationsApi } from '../api';

export const userAnnotationsProvider = {
    async annotate(
        userId: string,
        taskId: string,
        annotationBatchId: string,
        annotationBatch?: AnnotationBatch | undefined
    ) {
        const { data } = await userAnnotationsApi().annotateAndCompleteTask(
            userId,
            taskId,
            annotationBatchId,
            annotationBatch
        );
        return data;
    },
    async getReview(userId: string, taskId: string, annotationBatchId: string, reviewId: string) {
        const { data } = await userAnnotationsApi().getAnnotationReviewByUserTaskAnnotationBatch(
            userId,
            taskId,
            annotationBatchId,
            reviewId
        );
        return data;
    },
    async getReviews(userId: string, taskId: string, annotationBatchId: string) {
        const { data } = await userAnnotationsApi().getAnnotationReviewsByUserTaskAnnotationBatch(
            userId,
            taskId,
            annotationBatchId
        );
        return data;
    },
    async getBatch(userId: string, taskId: string, annotationBatchId: string) {
        const { data } = await userAnnotationsApi().getUserTaskAnnotationBatchById(userId, taskId, annotationBatchId);
        return data;
    },
    async getBatchs(userId: string, taskId: string) {
        const { data } = await userAnnotationsApi().getUserTaskAnnotationBatches(userId, taskId, 1, 500);
        return data;
    },
};
