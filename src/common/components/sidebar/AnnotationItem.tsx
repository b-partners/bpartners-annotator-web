import { Label } from '@bpartners-annotator/typescript-client';
import {
    Delete as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
    ListItem,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { FC } from 'react';
import { useCanvasAnnotationContext } from '../../context';
import { IAnnotationItemProps } from './type';

export const LabelSelector: FC<IAnnotationItemProps> = ({ annotation }) => {
    const { changeAnnotationLabel, labels } = useCanvasAnnotationContext();

    const handleClick = (label: Label) => () => {
        changeAnnotationLabel(annotation.id, label);
    };

    return (
        <TextField select value={annotation.label} size='small' sx={{ flexGrow: 2 }}>
            {labels.map(label => (
                <MenuItem onClick={handleClick(label)} key={label.id} value={label.name}>
                    {label.name}
                </MenuItem>
            ))}
        </TextField>
    );
};

export const AnnotationItem: FC<IAnnotationItemProps> = ({ annotation, selectLabel }) => {
    const { removeAnnotation, annotationsReviews } = useCanvasAnnotationContext();
    const { toggleAnnotationVisibility } = useCanvasAnnotationContext();
    const review = annotationsReviews.find(
        review => review.annotationId && annotation.uuid && review.annotationId === annotation.uuid
    );

    const toggleVisibility = () => toggleAnnotationVisibility(annotation.id);

    return (
        <Box>
            <ListItem
                secondaryAction={
                    <Stack direction='row'>
                        <IconButton edge='end' onClick={() => removeAnnotation(annotation.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                }
            >
                <IconButton sx={{ mr: 1 }} onClick={toggleVisibility}>
                    {annotation.isInvisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
                {selectLabel}
            </ListItem>
            {review && (
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Commentaires</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography textAlign='justify'>{review.comment}</Typography>
                    </AccordionDetails>
                </Accordion>
            )}
            <Divider />
        </Box>
    );
};
