import { Inbox as InboxIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

export const BpEmptyList: FC<{ text: string }> = ({ text }) => {
    return (
        <Box display='flex' color='#00000050' marginTop='2rem' width='100%' alignItems='center' flexDirection='column'>
            <div>
                <InboxIcon sx={{ fontSize: '6rem' }} />
            </div>
            <Typography width={200} textAlign='center'>
                {text}
            </Typography>
        </Box>
    );
};
