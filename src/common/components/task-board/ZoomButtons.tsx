import { ScaleCallbacks } from '@bpartners/annotator-component';
import { ZoomIn, ZoomOut, CropFree } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';

export const ZoomButtons = ({ scaleDown, scaleReste, scaleUp }: ScaleCallbacks) => (
    <Stack direction='row' spacing={1}>
        <IconButton data-cy='zoom-in-button' onClick={scaleUp} size='small'>
            <ZoomIn />
        </IconButton>
        <IconButton data-cy='zoom-out-button' onClick={scaleDown} size='small'>
            <ZoomOut />
        </IconButton>
        <IconButton data-cy='zoom-reset-button' onClick={scaleReste} size='small'>
            <CropFree />
        </IconButton>
    </Stack>
);
