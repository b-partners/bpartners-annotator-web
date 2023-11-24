import { Task, TaskStatus } from 'bpartners-annotator-Ts-client';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userTasksProvider } from '../../../providers';
import { useCanvasAnnotationContext } from '../../context';
import { retryer } from '../../utils';
import { BpButton } from '../basics';

export const NextAnnotationButton: FC<{ fetcher: () => void; task: Task }> = ({ fetcher, task }) => {
  const { setAnnotations } = useCanvasAnnotationContext();
  const { teamId, jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const cancelAnnotation = async () => {
    await retryer(async () => await userTasksProvider.updateOne(teamId || '', jobId || '', task.id || '', { ...task, status: TaskStatus.PENDING }));
  };

  const changeImage = () => {
    setIsLoading(true);
    cancelAnnotation()
      .then(() => {
        setAnnotations([]);
        fetcher();
      })
      .finally(() => setIsLoading(false));
  };

  return <BpButton isLoading={isLoading} onClick={changeImage} label="Changer d'image" />;
};
