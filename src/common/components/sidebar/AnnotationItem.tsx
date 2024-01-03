import { Label } from '@bpartners-annotator/typescript-client';
import { MenuItem } from '@mui/base';
import { Delete as DeleteIcon, ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    IconButton,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import { FC } from 'react';
import { useCanvasAnnotationContext } from '../../context';
import { useSession } from '../../hooks';
import { IAnnotationItemProps } from './type';

export const AnnotationItem: FC<IAnnotationItemProps> = ({ annotation }) => {
    const { changeAnnotationLabel, removeAnnotation, labels, annotationsReviews } = useCanvasAnnotationContext();

    const handleClick = (label: Label) => () => {
        changeAnnotationLabel(annotation.id, label);
    };

    const currentReview = annotationsReviews.find(
        review => review.annotationId && annotation.uuid && review.annotationId === annotation.uuid
    );

    const { isUser } = useSession();
    return isUser() ? (
        <>
            <ListItem
                secondaryAction={
                    <IconButton edge='end' onClick={() => removeAnnotation(annotation.id)}>
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <TextField select value={annotation.label} size='small' sx={{ flexGrow: 2 }}>
                    {labels.map(label => (
                        <MenuItem onClick={handleClick(label)} key={label.id} value={label.name}>
                            {label.name}
                        </MenuItem>
                    ))}
                </TextField>
            </ListItem>
            {currentReview && (
                // eslint-disable-next-line react/jsx-no-undef
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Commentaires</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography textAlign='justify'>{currentReview.comment}</Typography>
                    </AccordionDetails>
                </Accordion>
            )}
            <Divider />
        </>
    ) : (
        <div style={{ display: 'none' }}></div>
    );
};
