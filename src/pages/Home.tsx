import { Box, Stack, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { home_container } from '.';
import bp_logo from '../assets/bp-logo-full.webp';
import { BpButton } from '../common/components/basics';
import { authProvider } from '../providers';

export const Home = () => {
    const navigate = useNavigate();
    const { mutate, isLoading } = useMutation<string, AxiosError>({
        mutationFn: async () => {
            const url = await authProvider.getRedirectionBySession();
            navigate(url);
            return url;
        },
    });

    const handlerClick = () => mutate();

    return (
        <Box sx={home_container}>
            <Stack justifyContent='flex-start' position='relative' bottom={50}>
                <LazyLoadImage alt='Logo' width={400} src={bp_logo} />
                <Box width='30vw'>
                    <Typography fontSize={20} marginBottom={4}>
                        Notre application de labellisation est conçue pour simplifier le processus d&apos;annotation
                        d&apos;images.
                    </Typography>

                    <BpButton data-cy='start-button' label='Commencer' isLoading={isLoading} onClick={handlerClick} />
                </Box>
            </Stack>
        </Box>
    );
};
