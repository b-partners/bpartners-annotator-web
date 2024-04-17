import { AnnotationNumberPerLabel } from '@bpartners-annotator/typescript-client';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { jobsProvider } from '../../../providers';
import { useFetch } from '../../hooks';

export const JobStatistics = () => {
    const { jobId } = useParams();
    const { data, isLoading } = useFetch<AnnotationNumberPerLabel[], any>({
        fetcher: jobsProvider.getStatistics,
        defaultData: [],
        defaultParams: jobId,
    });

    return (
        <Box>
            <Box
                sx={{
                    width: '100%',
                    height: '85vh',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexWrap: 'wrap',
                    position: 'relative',
                    gap: 2,
                    p: 2,
                }}
            >
                {data?.map(stat => (
                    <Paper
                        sx={{
                            width: '10rem',
                            height: '10rem',
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography>{stat.labelName}</Typography>
                        <Typography sx={{ fontSize: '5rem' }}>{stat.numberOfAnnotations}</Typography>
                    </Paper>
                ))}
                {isLoading && (
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </Box>
    );
};
