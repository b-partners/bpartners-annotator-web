import { ExportFormat } from '@bpartners-annotator/typescript-client';
import { DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC } from 'react';
import { FormProvider, useForm, useFormContext, useWatch } from 'react-hook-form';
import { jobsProvider } from '../../../providers';
import { useDialog } from '../../context';
import { useFetch } from '../../hooks';
import { jobsExportDefaultValues, jobsExportResolver } from '../../resolvers';
import { palette } from '../../utils/theme';
import { BpButton, BpTextField } from '../basics';
import { ExportDialogProps, ExportJobFetcherParams } from './types';

export const FormatField = () => {
    const { format } = useWatch();
    const { register } = useFormContext();

    return (
        <TextField data-cy='format-input' select label='Format' {...register('format')} value={format}>
            <MenuItem value={ExportFormat.VGG}>VGG</MenuItem>
            <MenuItem value={ExportFormat.COCO}>COCO</MenuItem>
        </TextField>
    );
};

export const ExportJobDialog: FC<ExportDialogProps> = ({ jobId }) => {
    const { closeDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const form = useForm({ resolver: jobsExportResolver, mode: 'all', defaultValues: jobsExportDefaultValues });
    const { isLoading, fetcher } = useFetch<unknown, ExportJobFetcherParams>({
        fetcher: async params => {
            if (params) {
                const { emailCC, format } = params;
                await jobsProvider.exportOne(jobId, format, emailCC);
            }
        },
    });

    const handlerDone = () => {
        closeDialog();
        enqueueSnackbar({
            message: 'Job exporté avec succès',
            style: { background: palette().success.main },
        });
    };

    const handleExport = form.handleSubmit(data => fetcher(data, handlerDone));

    return (
        <div style={{ width: 500 }}>
            <FormProvider {...form}>
                <DialogTitle>
                    <span>Export de job</span>
                    <Typography color='text.secondary' variant='body1'>
                        id: {jobId}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} py={2}>
                        <BpTextField label='Email' name='emailCC' type='email' />
                        <FormatField />
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
