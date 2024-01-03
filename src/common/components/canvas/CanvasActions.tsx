import { CropFree, ZoomIn, ZoomOut } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import { useCanvasEditorContext } from '../../context';

export const CanvasAction = () => {
    const {
        zoom: { resetZoom, zoomIn, zoomOut },
    } = useCanvasEditorContext();

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
        </Stack>
    );
};
