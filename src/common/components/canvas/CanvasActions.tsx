import { CropFree, Edit, ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useCanvasAnnotationContext, useCanvasEditorContext } from '../../context';

export const CanvasAction = () => {
  const {
    zoom: { resetZoom, zoomIn, zoomOut },
  } = useCanvasEditorContext();

  const { setIsAnnotating, isAnnotating } = useCanvasAnnotationContext();

  const beginAnnotation = () => {
    setIsAnnotating(true);
  };

  return (
    <Stack direction='row' spacing={1}>
      <IconButton onClick={zoomIn} size='small'>
        <ZoomIn />
      </IconButton>
      <IconButton onClick={zoomOut} size='small'>
        <ZoomOut />
      </IconButton>
      <IconButton onClick={resetZoom} size='small'>
        <CropFree />
      </IconButton>
      <IconButton disabled={isAnnotating} onClick={beginAnnotation} size='small'>
        <Edit />
      </IconButton>
    </Stack>
  );
};
