import { AnnotationReview, ReviewStatus } from '@bpartners-annotator/typescript-client';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { v4 as uuidV4 } from 'uuid';
import { annotationsProvider } from '../../../providers/admin/annotations-provider';
import { useDialog } from '../../context';
import { rejectionCommentDefaultValues, rejectionCommentResolver } from '../../resolvers/rejection-comment-resolver';
import { urlParamsHandler } from '../../utils';
import { BpButton, BpTextField } from '../basics';

type RejectionDialogProps = {
    batchId: string;
    comments: Record<string, AnnotationReview>;
    changeCurrentTask: () => void;
};

export const RejectionDialog: FC<RejectionDialogProps> = ({ batchId, comments, changeCurrentTask }) => {
    const form = useForm({
        mode: 'all',
        resolver: rejectionCommentResolver,
        defaultValues: rejectionCommentDefaultValues,
    });
    const { closeDialog } = useDialog();
    const [isLoading, setLoading] = useState(false);
    const { jobId } = useParams() as { jobId: string };
    const { taskId } = urlParamsHandler({ taskId: '' });

    const handleReject = form.handleSubmit(() => {
        const reviewId = uuidV4();
        const comment = form.watch('comment');
        setLoading(true);
        annotationsProvider
            .updateReview(jobId, taskId, batchId, reviewId, {
                id: reviewId,
                annotationBatchId: batchId,
                reviews: [
                    {
                        comment,
                        id: uuidV4(),
                    },
                    ...Object.values(comments),
                ],
                status: ReviewStatus.REJECTED,
            })
            .then(() => {
                closeDialog();
                changeCurrentTask();
            })
            .finally(() => {
                setLoading(false);
            });
    });

    return (
        <FormProvider {...form}>
            <DialogTitle>
                <span>Rejet d'annotation</span>
                <Typography color='text.secondary' variant='subtitle1'>
                    id: {batchId}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                    Veuillez commenté ci dessous la raison du rejet de cette annotation.
                </DialogContentText>
                <BpTextField name='comment' label='Commentaire' multiline minRows={3} fullWidth margin='dense' />
            </DialogContent>
            <DialogActions>
                <Stack width='100%' justifyContent='space-between' direction='row'>
                    <BpButton label='Annuler' isLoading={isLoading} onClick={closeDialog} />
                    <BpButton label='Rejeter' isLoading={isLoading} onClick={handleReject} />
                </Stack>
            </DialogActions>
        </FormProvider>
    );
};
