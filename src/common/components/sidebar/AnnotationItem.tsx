import { Label } from '@bpartners-annotator/typescript-client';
import { MenuItem } from '@mui/base';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
    ListItem,
    TextField,
    Typography,
} from '@mui/material';
import { FC } from 'react';
import { useCanvasAnnotationContext } from '../../context';
import { IAnnotationItemProps } from './type';

export const AnnotationItem: FC<IAnnotationItemProps> = ({ annotation }) => {
    const { changeAnnotationLabel, removeAnnotation, labels, annotationsReviews } = useCanvasAnnotationContext();

    const handleClick = (label: Label) => () => {
        changeAnnotationLabel(annotation.id, label);
    };

    const currentReview = annotationsReviews.find(
        review => review.annotationId && annotation.uuid && review.annotationId === annotation.uuid
    );

    return (
        <Box>
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
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Commentaires</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography textAlign='justify'>{currentReview.comment}</Typography>
                    </AccordionDetails>
                </Accordion>
            )}
            <Divider />
        </Box>
    );
};
