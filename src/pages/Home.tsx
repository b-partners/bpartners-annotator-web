import { Box, Button, Stack, Typography } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { home_container } from '.';
import bp_logo from '../assets/bp-logo-full.webp';

export const Home = () => {
  return (
    <Box sx={home_container}>
      <Stack justifyContent='flex-start' position='relative' bottom={50}>
        <LazyLoadImage alt='Logo' width={400} src={bp_logo} />
        <Box width='30vw'>
          <Typography fontSize={20} marginBottom={4}>
            Notre application de labellisation est conçue pour simplifier le processus d&apos;annotation d&apos;images.
          </Typography>

          <Link to='/teams/bf61795f-f701-458e-8b6e-c72814bf036c/jobs'>
            <Button>Commencer</Button>
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
