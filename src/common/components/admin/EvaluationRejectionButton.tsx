import { useCanvasAnnotationContext, useDialog } from '../../context';
import { useEvaluationCommentContext } from '../../context/admin';
import { BpButton } from '../basics';
import { RejectionDialog } from './RejectionDialog';

export const EvaluationRejectionButton = () => {
    const { openDialog } = useDialog();
    const { batchId, changeCurrentTask } = useCanvasAnnotationContext();
    const { comments } = useEvaluationCommentContext();

    const handleClick = () =>
        openDialog(<RejectionDialog comments={comments} batchId={batchId} changeCurrentTask={changeCurrentTask} />);

    return <BpButton label='Rejeter' onClick={handleClick} />;
};
