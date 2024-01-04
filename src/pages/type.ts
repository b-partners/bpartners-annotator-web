import { AnnotationBatch, AnnotationReview, Job, Task } from '@bpartners-annotator/typescript-client';

export interface UseJobTaskState {
    task: Task | null;
    job: Job | null;
}

export interface IUseTaskBoardState {
    task: Task | null;
    job: Job | null;
    annotationsReviews: AnnotationReview[] | null;
    globalReviews: AnnotationReview[] | null;
    annotationBatch: AnnotationBatch | null;
}
