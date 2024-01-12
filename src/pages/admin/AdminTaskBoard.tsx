import { AnnotationBatch, Job, Task } from '@bpartners-annotator/typescript-client';
import { Box, CircularProgress, Grid, List, ListSubheader, MenuItem, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { CancelEvaluationButton, EvaluationRejectionButton, ValidateButton } from '../../common/components/admin';
import { Canvas } from '../../common/components/canvas';
import { Sidebar } from '../../common/components/sidebar';
import { CanvasAnnotationProvider } from '../../common/context';
import { EvaluationCommentProvider } from '../../common/context/admin';
import { useFetch } from '../../common/hooks';
import { dateFormater, getTaskToValidate, retryer } from '../../common/utils';
import { tasksProvider } from '../../providers';
import { canvas_loading } from '../style';

type AdminTaskJobLoaderReturn = {
    batchs: AnnotationBatch[];
    task: Task;
    job: Job;
    tasks: Task[];
};

export const AdminTaskBoard = () => {
    const { batchs, job, task, tasks } = useLoaderData() as AdminTaskJobLoaderReturn;
    const [batch, setBatch] = useState(batchs[0] || {});
    const params = useParams();
    const navigate = useNavigate();

    const fetcher = async () => {
        const tasks = (await retryer(tasksProvider.getList(params?.jobId || ''))) || [];
        const task = getTaskToValidate(tasks);
        if (task === null) {
            navigate(`/jobs`);
        }
        return task;
    };

    const {
        data: currenTask,
        isLoading,
        fetcher: changeCurrentTask,
    } = useFetch({ fetcher, defaultData: task, onlyOnMutate: true });

    return currenTask !== null && !isLoading ? (
        <EvaluationCommentProvider>
            <CanvasAnnotationProvider
                changeCurrentTask={changeCurrentTask}
                tasks={tasks}
                batch={batch}
                img={currenTask.imageUri || ''}
                labels={job?.labels || []}
            >
                <Grid container height='94%' pl={1}>
                    <Grid
                        container
                        item
                        xs={10}
                        display='flex'
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <div>{job && <Canvas isLoading={false} job={job} />}</div>
                        <Stack justifyContent='space-between' direction='row' width='70vh' mt={1}>
                            <EvaluationRejectionButton />
                            <ValidateButton />
                        </Stack>
                    </Grid>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
                        <Stack flexGrow={2}>
                            <List subheader={<ListSubheader>Versions de l'annotation</ListSubheader>}>
                                <Stack pt={2} pb={3} px={2}>
                                    <TextField
                                        select
                                        value={dateFormater(batch.creationDatetime)}
                                        size='small'
                                        fullWidth
                                    >
                                        {batchs.map(batch => {
                                            const date = dateFormater(batch.creationDatetime);
                                            return (
                                                <MenuItem onClick={() => setBatch(batch)} key={date} value={date}>
                                                    {date}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>
                                </Stack>
                            </List>
                            <Sidebar />
                        </Stack>
                        <Stack spacing={1} m={2} mb={1}>
                            <CancelEvaluationButton />
                        </Stack>
                    </Grid>
                </Grid>
            </CanvasAnnotationProvider>
        </EvaluationCommentProvider>
    ) : (
        <Box sx={canvas_loading}>
            <CircularProgress />
        </Box>
    );
};
