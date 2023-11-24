import { Button } from '@mui/material';
import { useCanvasAnnotationContext } from '../../context';

export const CancelAnnotationButton = () => {
  const { setAnnotations } = useCanvasAnnotationContext();
  const cancel = () => setAnnotations([]);
  return <Button onClick={cancel}>Annuler</Button>;
};
