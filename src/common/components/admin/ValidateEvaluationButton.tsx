import { ReviewStatus } from '@bpartners-annotator/typescript-client';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidV4 } from 'uuid';
import { annotationsProvider } from '../../../providers/admin/annotations-provider';
import { useCanvasAnnotationContext } from '../../context';
import { useGetPrevRoute } from '../../hooks';
import { BpButton } from '../basics';

export const ValidateButton = () => {
    const { batchId } = useCanvasAnnotationContext();
    const [isLoading, setLoading] = useState(false);
    const { jobId, taskId } = useParams() as { jobId: string; taskId: string };
    const getPrevRoute = useGetPrevRoute();
    const navigate = useNavigate();

    const handleValidate = () => {
        const reviewId = uuidV4();
        setLoading(true);
        annotationsProvider
            .updateReview(jobId, taskId, batchId, reviewId, {
                id: reviewId,
                annotationBatchId: batchId,
                reviews: [],
                status: ReviewStatus.ACCEPTED,
            })
            .then(() => {
                navigate(getPrevRoute());
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return <BpButton label='Valider' onClick={handleValidate} isLoading={isLoading} />;
};
