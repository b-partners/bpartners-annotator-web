import { useCanvasAnnotationContext, useDialog } from '../../context';
import { BpButton } from '../basics';
import { RejectionDialog } from './RejectionDialog';

export const EvaluationRejectionButton = () => {
    const { openDialog } = useDialog();
    const { batchId } = useCanvasAnnotationContext();

    const handleClick = () => openDialog(<RejectionDialog batchId={batchId} />);

    return <BpButton label='Rejeter' onClick={handleClick} />;
};
