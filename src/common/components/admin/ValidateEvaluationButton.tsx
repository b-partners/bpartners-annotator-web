import { ReviewStatus } from '@bpartners-annotator/typescript-client';
import { useState } from 'react';
import { useParams } from 'react-router';
import { v4 as uuidV4 } from 'uuid';
import { annotationsProvider } from '../../../providers/admin/annotations-provider';
import { useCanvasAnnotationContext } from '../../context';
import { urlParamsHandler } from '../../utils';
import { BpButton } from '../basics';

export const ValidateButton = () => {
    const { batchId, changeCurrentTask } = useCanvasAnnotationContext();
    const [isLoading, setLoading] = useState(false);
    const { jobId } = useParams() as { jobId: string };
    const { taskId } = urlParamsHandler({ taskId: '' });

    const handleValidate = () => {
        const reviewId = uuidV4();
        setLoading(true);
        annotationsProvider
            .updateReview(jobId, taskId, batchId, reviewId, {
                id: reviewId,
                annotationBatchId: batchId,
                reviews: [],
                status: ReviewStatus.ACCEPTED
            })
            .then(() => {
                changeCurrentTask();
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return <BpButton label='Valider' onClick={handleValidate} isLoading={isLoading} />;
};
