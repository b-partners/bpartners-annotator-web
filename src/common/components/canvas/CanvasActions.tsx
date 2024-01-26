import { CropFree, ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useCanvasEditorContext } from '../../context';

export const CanvasAction = () => {
    const {
        zoom: { resetZoom, zoomIn, zoomOut },
    } = useCanvasEditorContext();

    return (
        <Stack direction='row' spacing={1}>
            <IconButton data-cy='zoom-in-button' onClick={zoomIn} size='small'>
                <ZoomIn />
            </IconButton>
            <IconButton data-cy='zoom-out-button' onClick={zoomOut} size='small'>
                <ZoomOut />
            </IconButton>
            <IconButton data-cy='zoom-reset-button' onClick={resetZoom} size='small'>
                <CropFree />
            </IconButton>
        </Stack>
    );
};
