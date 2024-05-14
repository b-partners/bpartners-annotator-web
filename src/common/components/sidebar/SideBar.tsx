import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useCanvasAnnotationContext } from '../../context';
import { useSession } from '../../hooks';
import { BpEmptyList } from '../basics';
import { AnnotationItem, LabelSelector } from './AnnotationItem';
import { AdminAnnotationItem } from './admin';

const getWindowHeightByPercentage = (percentage: number) => (window.innerHeight * percentage) / 100;

const AccordionStyle = {
    maxHeight: getWindowHeightByPercentage(45),
    minHeight: getWindowHeightByPercentage(30),
    overflow: 'auto',
    padding: 0,
};

export const Sidebar = () => {
    const { annotations } = useCanvasAnnotationContext();

    const { isAdmin, isUser } = useSession();

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontSize={10}>Labels</Typography>
            </AccordionSummary>
            <AccordionDetails sx={AccordionStyle}>
                <Box py={2}>
                    {isAdmin() &&
                        annotations.map(annotation => (
                            <AdminAnnotationItem key={annotation.id} annotation={annotation} />
                        ))}
                    {isUser() &&
                        annotations.map(annotation => (
                            <AnnotationItem
                                key={annotation.id}
                                annotation={annotation}
                                // If it is implemented directly in the annotation item component, it will caused context list error.
                                selectLabel={<LabelSelector annotation={annotation} />}
                            />
                        ))}
                    {annotations.length === 0 && <BpEmptyList text="Pas encore d'annotation effectuée." />}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
