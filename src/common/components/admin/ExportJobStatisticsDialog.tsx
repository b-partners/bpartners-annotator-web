import { DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import { jobsProvider } from '../../../providers';
import { useDialog } from '../../context';
import { useFetch } from '../../hooks';
import { useExportStatisticForm } from '../../resolvers';
import { palette } from '../../utils/theme';
import { BpButton, BpTextField } from '../basics';
import { ExportDialogProps, ExportJobStatisticsFetcherParams } from './types';

export const ExportJobStatisticsDialog: FC<ExportDialogProps> = ({ jobId }) => {
    const { closeDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const form = useExportStatisticForm()
    const { isLoading, fetcher } = useFetch<unknown, ExportJobStatisticsFetcherParams>({
        fetcher: async params => {
            if (params) {
                await jobsProvider.exportStatistics(jobId);
            }
        },
    });

    const handlerDone = () => {
        closeDialog();
        enqueueSnackbar({
            message: 'Statistiques du job exportées avec succès',
            style: { background: palette().success.main },
        });
    };

    const handleExport = form.handleSubmit(data => fetcher(data, handlerDone));

    return (
        <div style={{ width: 500 }}>
            <FormProvider {...form}>
                <DialogTitle>
                    <span>Export des statistiques du job</span>
                    <Typography color='text.secondary' variant='body1'>
                        id: {jobId}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} py={2}>
                        <BpTextField label='Email' name='email' type='email' />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Stack width='100%' justifyContent='space-between' direction='row'>
                        <BpButton
                            data-cy='export-dialog-cancel-button'
                            label='Annuler'
                            isLoading={isLoading}
                            onClick={closeDialog}
                        />
                        <BpButton
                            data-cy='export-dialog-export-button'
                            label='Exporter'
                            isLoading={isLoading}
                            onClick={handleExport}
                        />
                    </Stack>
                </DialogActions>
            </FormProvider>
        </div>
    );
};
