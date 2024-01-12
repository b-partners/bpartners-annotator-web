import { Annotation, AnnotationBatch, Whoami } from '@bpartners-annotator/typescript-client';
import {
    Checkbox,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Stack,
} from '@mui/material';
import { FC, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { userAnnotationsProvider } from '../../../providers/annotator/user-annotations-provider';
import { IAnnotation, useCanvasAnnotationContext, useDialog } from '../../context';
import { useFetch } from '../../hooks';
import { annotationsMapper } from '../../mappers';
import { cache } from '../../utils';
import { BpButton } from '../basics';
import { IConfirmButton } from './types';

const NoAnnotationConfirm: FC<{ fetcher: () => Promise<void> }> = ({ fetcher }) => {
    const { closeDialog } = useDialog();
    const { fetcher: fetch, isLoading } = useFetch({ fetcher, onlyOnMutate: true });

    const handleClick = () => fetch({}, () => closeDialog());

    return (
        <>
            <DialogTitle>Rejet d'annotation</DialogTitle>
            <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                    Aucune annotation ne sera faite sur cette image.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Stack width='100%' justifyContent='space-between' direction='row'>
                    <BpButton label='Annuler' isLoading={isLoading} onClick={closeDialog} />
                    <BpButton label='Valider' isLoading={isLoading} onClick={handleClick} />
                </Stack>
            </DialogActions>
        </>
    );
};

const areReadyForValidation = (annotations: IAnnotation[]) => {
    for (let i = 0; i < annotations.length; i++) {
        if (annotations[i].label.length === 0) return false;
    }
    return true;
};

export const ConfirmAnnotationButton: FC<IConfirmButton> = ({ labels, onEnd, task, isFetcherLoading }) => {
    const { annotations, setAnnotations } = useCanvasAnnotationContext();
    const [noAnnotation, setNoAnnotation] = useState(false);
    const { openDialog } = useDialog();

    const fetcher = async () => {
        const whoami = cache.getWhoami() as Whoami;
        const userId = whoami.user?.id || '';
        const taskAnnotation: Annotation[] = annotations.map(annotation =>
            annotationsMapper.toRest(annotation, labels, task.id)
        );

        const annotationBatch: AnnotationBatch = { id: uuidV4(), annotations: taskAnnotation };
        try {
            await userAnnotationsProvider.annotate(userId, task.id || '', annotationBatch.id || '', annotationBatch);
            cache.deleteCurrentTask();
            setAnnotations([]);
            onEnd();
            setNoAnnotation(false);
        } catch (err) {
            alert((err as Error).message);
        } finally {
            return;
        }
    };

    const { fetcher: fetch, isLoading } = useFetch({ fetcher, onlyOnMutate: true });

    const handleClick = () => {
        const areReady = areReadyForValidation(annotations);
        if (areReady && !noAnnotation) {
            fetch();
        } else if (areReady) {
            openDialog(<NoAnnotationConfirm fetcher={fetcher} />);
        } else {
            alert('Veuillez donner un label pour chaque annotation.');
        }
    };

    return (
        <Stack>
            <BpButton
                label='Valider l’annotation'
                onClick={handleClick}
                disabled={!noAnnotation && annotations.length === 0}
                isLoading={isLoading || isFetcherLoading}
            />
            <FormControlLabel
                label='Rien à labelliser'
                control={
                    <Checkbox value={noAnnotation} checked={noAnnotation} onClick={() => setNoAnnotation(e => !e)} />
                }
            />
        </Stack>
    );
};
