import { useCanvasAnnotationContext, useDialog } from '../../context';
import { useEvaluationCommentContext } from '../../context/admin';
import { BpButton } from '../basics';
import { RejectionDialog } from './RejectionDialog';

export const EvaluationRejectionButton = () => {
    const { openDialog } = useDialog();
    const { batchId } = useCanvasAnnotationContext();
    const { comments } = useEvaluationCommentContext();

    const handleClick = () => openDialog(<RejectionDialog comments={comments} batchId={batchId} />);

    return <BpButton label='Rejeter' onClick={handleClick} />;
};
