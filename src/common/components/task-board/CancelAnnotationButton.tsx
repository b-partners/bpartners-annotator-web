import { useCanvasAnnotationContext } from '../../context';
import { BpButton } from '../basics';

export const CancelAnnotationButton = () => {
    const { setAnnotations } = useCanvasAnnotationContext();
    const cancel = () => setAnnotations([]);
    return <BpButton data-cy='cancel-annotation-button' onClick={cancel} label="Annuler l'annotation" />;
};
