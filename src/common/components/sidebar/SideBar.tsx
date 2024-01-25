import { Box, List, ListSubheader } from '@mui/material';
import { useCanvasAnnotationContext } from '../../context';
import { useSession } from '../../hooks';
import { BpEmptyList } from '../basics';
import { AnnotationItem, LabelSelector } from './AnnotationItem';
import { AdminAnnotationItem } from './admin';

export const Sidebar = () => {
    const { annotations } = useCanvasAnnotationContext();

    const { isAdmin, isUser } = useSession();

    return (
        <List
            sx={{ maxHeight: window.innerHeight * 0.7, overflow: 'auto' }}
            subheader={<ListSubheader>Labels</ListSubheader>}
        >
            <Box py={2}>
                {isAdmin() &&
                    annotations.map(annotation => <AdminAnnotationItem key={annotation.id} annotation={annotation} />)}
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
        </List>
    );
};
