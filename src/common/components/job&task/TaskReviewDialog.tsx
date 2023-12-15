import { AnnotationReview } from '@bpartners-annotator/typescript-client';
import { DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, Stack, Typography } from '@mui/material';
import { FC } from 'react';
import { useDialog } from '../../context';
import { BpButton, BpEmptyList } from '../basics';

export const TaskReviewDialog: FC<{ globalReviews: AnnotationReview[] }> = ({ globalReviews }) => {
    const { closeDialog } = useDialog();

    return (
        <>
            <DialogTitle>
                <Typography>Commentaires de l'annotation</Typography>
            </DialogTitle>
            <DialogContent sx={{ minWidth: '30vw' }}>
                {globalReviews.length === 0 && (
                    <BpEmptyList text="Il n'y a pas encore de commentaire disponible pour cette annotation." />
                )}
                {globalReviews.length !== 0 && (
                    <List sx={{ padding: 1, maxHeight: '40vh', overflow: 'auto' }}>
                        {globalReviews.map(review => {
                            return (
                                <>
                                    <ListItem sx={{ paddingX: 1, paddingY: 3, width: '100%' }}>
                                        {review.comment}
                                    </ListItem>
                                    <Divider color='#000000' />
                                </>
                            );
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Stack width='100%' justifyContent=' flex-end' direction='row'>
                    <BpButton label='Fermer' onClick={closeDialog} />
                </Stack>
            </DialogActions>
        </>
    );
};
