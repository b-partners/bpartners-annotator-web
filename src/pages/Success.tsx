/* eslint-disable react-hooks/exhaustive-deps */
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { container_center_flex } from '.';
import bp_logo from '../assets/bp-logo-full.webp';
import { redirectionByRole } from '../common/utils';
import { accountProvider } from '../providers/general/account-provider';

const useFetchWhoami = () => {
    const navigate = useNavigate();

    return useQuery({
        queryKey: ['whoami'],
        queryFn: async () => {
            const whoami = await accountProvider.whoami();
            const redirectionUrl = redirectionByRole(whoami);
            navigate(redirectionUrl);
        },
    });
};

export const Success = () => {
    useFetchWhoami();
    return (
        <Box sx={container_center_flex}>
            <Stack>
                <LazyLoadImage alt='bp_logo' width={300} src={bp_logo} />
                <div className='circular-progress-container'>
                    <CircularProgress />
                </div>
            </Stack>
            <Typography className='redirection-message'>
                Vous allez être redirigés vers votre espace personnel.
            </Typography>
        </Box>
    );
};
