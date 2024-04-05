import { ExportFormat } from '@bpartners-annotator/typescript-client';

export interface ExportDialogProps {
    jobId: string;
}
export interface ExportJobFetcherParams {
    format: ExportFormat;
    emailCC: string;
    page?: number;
    perPage?: number;
}
