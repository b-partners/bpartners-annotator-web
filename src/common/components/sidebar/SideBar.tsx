import { Box, List, ListSubheader } from '@mui/material';
import { FC } from 'react';
import { IAnnotationItemProps } from '.';
import { useCanvasAnnotationContext } from '../../context';
import { BpEmptyList } from '../basics';
import { AnnotationItem } from './AnnotationItem';
import { AdminAnnotationItem } from './admin';

const LabelItem: FC<IAnnotationItemProps> = ({ annotation }) => {
    return (
        <>
            <AnnotationItem annotation={annotation} />
            <AdminAnnotationItem annotation={annotation} />
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
