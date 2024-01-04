import { Label } from '@bpartners-annotator/typescript-client';
import { Delete, ExpandMore } from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import { IAnnotation, useCanvasAnnotationContext } from '../../context';
import { useSession } from '../../hooks';
import { BpEmptyList } from '../basics';
import { AdminAnnotationItem } from './admin';

export const Sidebar = () => {
    const { annotations } = useCanvasAnnotationContext();

    const { isAdmin, isUser } = useSession();

    const { changeAnnotationLabel, removeAnnotation, labels, annotationsReviews } = useCanvasAnnotationContext();

    const handleClick = (label: Label, annotation: IAnnotation) => () => {
        changeAnnotationLabel(annotation.id, label);
    };

    const currentReview = (annotation: IAnnotation) =>
        annotationsReviews.find(
            review => review.annotationId && annotation.uuid && review.annotationId === annotation.uuid
        );

    console.log(annotationsReviews);

    return (
        <List
            sx={{ maxHeight: window.innerHeight * 0.7, overflow: 'auto' }}
            subheader={<ListSubheader>Labels</ListSubheader>}
        >
            <Box py={2}>
                {isAdmin() &&
                    annotations.map(annotation => <AdminAnnotationItem key={annotation.id} annotation={annotation} />)}
                {isUser() &&
                    annotations.map(annotation => {
                        const review = currentReview(annotation);

                        return (
                            <Box key={annotation.id}>
                                <ListItem
                                    secondaryAction={
                                        <IconButton edge='end' onClick={() => removeAnnotation(annotation.id)}>
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <TextField select value={annotation.label} size='small' sx={{ flexGrow: 2 }}>
                                        {labels.map(label => (
                                            <MenuItem
                                                onClick={handleClick(label, annotation)}
                                                key={label.id}
                                                value={label.name}
                                            >
                                                {label.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </ListItem>
                                {review && (
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
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
                    })}
                {annotations.length === 0 && <BpEmptyList text="Pas encore d'annotation effectuée." />}
            </Box>
        </List>
    );
};
