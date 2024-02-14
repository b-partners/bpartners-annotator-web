import { Button } from '@mui/material';
import { useCanvasAnnotationContext } from '../../context';

export const CancelAnnotationButton = () => {
    const { setAnnotations } = useCanvasAnnotationContext();
    const cancel = () => setAnnotations([]);
    return (
        <Button data-cy='cancel-annotation-button' onClick={cancel}>
            Annuler l'annotation
        </Button>
    );
};
