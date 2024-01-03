import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { home_container } from '.';
import bp_logo from '../assets/bp-logo-full.webp';
import { BpButton } from '../common/components/basics';
import { authProvider } from '../providers';

export const Home = () => {
    const [isLoading, setLoading] = useState(false);
    const redirection = authProvider.getRedirectionBySession();

    useEffect(() => {
        return () => setLoading(false);
    }, []);

    return (
        <Box sx={home_container}>
            <Stack justifyContent='flex-start' position='relative' bottom={50}>
                <LazyLoadImage alt='Logo' width={400} src={bp_logo} />
                <Box width='30vw'>
                    <Typography fontSize={20} marginBottom={4}>
                        Notre application de labellisation est conçue pour simplifier le processus d&apos;annotation
                        d&apos;images.
                    </Typography>

                    <BpButton
                        label='Commencer'
                        isLoading={isLoading}
                        onClick={() => setLoading(true)}
                        to={redirection}
                    />
                </Box>
            </Stack>
        </Box>
    );
};
