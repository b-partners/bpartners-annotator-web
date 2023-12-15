import { Label } from '@bpartners-annotator/typescript-client';
import { Delete as DeleteIcon, ExpandMore } from '@mui/icons-material';
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
import { FC } from 'react';
import { ILabelItemProps } from '.';
import { useCanvasAnnotationContext } from '../../context';
import { BpEmptyList } from '../basics';

const LabelItem: FC<ILabelItemProps> = ({ annotation }) => {
    const { changeAnnotationLabel, removeAnnotation, labels, annotationsReviews } = useCanvasAnnotationContext();

    const handleClick = (label: Label) => () => {
        changeAnnotationLabel(annotation.id, label);
    };

    console.log(annotationsReviews);

    const currentReview = annotationsReviews.find(
        review => review.annotationId && annotation.uuid && review.annotationId === annotation.uuid
    );

    return (
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
    );
};

export const Sidebar = () => {
    const { annotations } = useCanvasAnnotationContext();

    return (
        <List
            sx={{ maxHeight: window.innerHeight * 0.7, overflow: 'auto' }}
            subheader={<ListSubheader>Labels</ListSubheader>}
        >
            <Box py={2}>
                {annotations.map((annotation, k) => (
                    <LabelItem annotation={annotation} key={`${k} ${annotation.id}`} />
                ))}
                {annotations.length === 0 && <BpEmptyList text="Pas encore d'annotation effectuée." />}
            </Box>
        </List>
    );
};
