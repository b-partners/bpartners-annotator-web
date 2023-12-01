import { AnnotationBatch, Job, ReviewStatus, Task } from '@bpartners-annotator/typescript-client';
import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListSubheader,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';
import { BpButton, BpTextField } from '../../common/components/basics';
import { Canvas } from '../../common/components/canvas';
import { Sidebar } from '../../common/components/sidebar';
import { CanvasAnnotationProvider, useCanvasAnnotationContext, useDialog } from '../../common/context';
import { useGetPrevRoute } from '../../common/hooks';
import { rejectionCommentDefaultValues, rejectionCommentResolver } from '../../common/resolvers/rejection-comment-resolver';
import { annotationsProvider } from '../../providers/admin/annotations-provider';
import { canvas_loading } from '../style';

export const RejectionDialog: FC<{ batchId: string }> = ({ batchId }) => {
  const form = useForm({ mode: 'all', resolver: rejectionCommentResolver, defaultValues: rejectionCommentDefaultValues });
  const { closeDialog } = useDialog();
  const [isLoading, setLoading] = useState(false);
  const { jobId, taskId } = useParams() as { jobId: string; taskId: string };
  const getPrevRoute = useGetPrevRoute();
  const navigate = useNavigate();

  const handleReject = form.handleSubmit(() => {
    const reviewId = uuidV4();
    const comment = form.watch('comment');
    setLoading(true);
    annotationsProvider
      .updateReview(jobId, taskId, batchId, reviewId, {
        id: reviewId,
        annotationBatchId: batchId,
        reviews: [
          {
            comment,
            id: uuidV4(),
          },
        ],
        status: ReviewStatus.REJECTED,
      })
      .then(() => {
        closeDialog();
        navigate(getPrevRoute());
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <FormProvider {...form}>
      <DialogTitle>
        <span>Rejet d'annotation</span>
        <Typography color='text.secondary' variant='subtitle1'>
          id: {batchId}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>Veuillez commenté ci dessous la raison du rejet de cette annotation.</DialogContentText>
        <BpTextField name='comment' label='Commentaire' multiline minRows={3} fullWidth margin='dense' />
      </DialogContent>
      <DialogActions>
        <Stack width='100%' justifyContent='space-between' direction='row'>
          <BpButton label='Annuler' isLoading={isLoading} onClick={closeDialog} />
          <BpButton label='Rejeter' isLoading={isLoading} onClick={handleReject} />
        </Stack>
      </DialogActions>
    </FormProvider>
  );
};

export const RejectButton = () => {
  const { openDialog } = useDialog();
  const { batchId } = useCanvasAnnotationContext();

  const handleClick = () => openDialog(<RejectionDialog batchId={batchId} />);

  return <BpButton label='Rejeter' onClick={handleClick} />;
};

export const ValidateButton = () => {
  return <BpButton label='Valider' />;
};

export const AdminTaskBoard = () => {
  const { batchs, job, task } = useLoaderData() as { batchs: AnnotationBatch[]; task: Task; job: Job };
  const [batch, setBatch] = useState(batchs[0]);

  return task !== null ? (
    <CanvasAnnotationProvider batch={batch} img={task.imageUri || ''} labels={job?.labels || []}>
      <Grid container height='94%' pl={1}>
        <Grid container item xs={10} display='flex' direction='column' justifyContent='center' alignItems='center'>
          <div>{job && <Canvas isLoading={false} job={job} />}</div>
          <Stack justifyContent='space-between' direction='row' width='70vh' mt={1}>
            <RejectButton />
            <Box flexGrow={1}></Box>
            <ValidateButton />
          </Stack>
        </Grid>
        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} item xs={2}>
          <Stack flexGrow={2}>
            <List subheader={<ListSubheader>Versions de l'annotation</ListSubheader>}>
              <Stack pt={2} pb={3} px={2}>
                <TextField select value={batch.id} size='small' fullWidth>
                  {batchs.map(batch => (
                    <MenuItem onClick={() => setBatch(batch)} key={batch.id} value={batch.id}>
                      {batch.id}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </List>
            <Sidebar />
          </Stack>
          <Stack spacing={1} m={2} mb={1}></Stack>
        </Grid>
      </Grid>
    </CanvasAnnotationProvider>
  ) : (
    <Box sx={canvas_loading}>
      <CircularProgress />
    </Box>
  );
};
