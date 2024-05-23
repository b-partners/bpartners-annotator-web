import { Annotation, AnnotationBatch, Whoami } from '@bpartners-annotator/typescript-client';
import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { userAnnotationsProvider } from '../../../providers/annotator/user-annotations-provider';
import { IAnnotation, useCanvasAnnotationContext } from '../../context';
import { useFetch } from '../../hooks';
import { annotationsMapper } from '../../mappers';
import { cache } from '../../utils';
import { palette } from '../../utils/theme';
import { BpButton } from '../basics';
import { IConfirmButton } from './types';

const areReadyForValidation = (annotations: IAnnotation[]) => {
    for (let i = 0; i < annotations.length; i++) {
        if (annotations[i].label.length === 0) return false;
    }
    return true;
};

export const ConfirmAnnotationButton: FC<IConfirmButton> = ({ labels, onEnd, task, isFetcherLoading }) => {
    const { annotations, setAnnotations } = useCanvasAnnotationContext();
    const [noAnnotation, setNoAnnotation] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

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
            enqueueSnackbar((err as Error).message, { style: { background: palette().error.dark } });
        } finally {
            return;
        }
    };

    const { fetcher: fetch, isLoading } = useFetch({ fetcher, onlyOnMutate: true });

    const handleClick = () => {
        const areReady = areReadyForValidation(annotations);
        if (areReady) {
            fetch();
            return;
        } else {
            enqueueSnackbar('Veuillez donner un label pour chaque annotation.', {
                style: { background: palette().error.dark },
            });
        }
    };

    return (
        <Stack>
            <BpButton
                data-cy='validate-annotation-button'
                label='Valider l’annotation'
                onClick={handleClick}
                disabled={!noAnnotation && annotations && annotations.length === 0}
                isLoading={isLoading || isFetcherLoading}
            />
            <FormControlLabel
                label='Rien à labelliser'
                control={
                    <Checkbox
                        data-cy='validate-annotation-without-polygone'
                        value={noAnnotation}
                        checked={noAnnotation}
                        onClick={() => setNoAnnotation(e => !e)}
                    />
                }
            />
        </Stack>
    );
};
