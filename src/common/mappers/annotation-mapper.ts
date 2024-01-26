import { Annotation, Label } from '@bpartners-annotator/typescript-client';
import { v4 as uuidV4 } from 'uuid';
import { IAnnotation } from '../context';
import { cache, getColorFromMain } from '../utils';

export const annotationsMapper = {
    toDomain(annotation: Annotation, id: number): IAnnotation {
        const { fillColor, strokeColor } = getColorFromMain(annotation.label?.color || '');
        return {
            id,
            uuid: annotation.id,
            label: annotation.label?.name || '',
            polygon: {
                fillColor,
                strokeColor,
                points: annotation.polygon?.points as any
            }
        };
    },
    toRest(annotation: IAnnotation, labels: Label[], taskId?: string): Annotation {
        const { user } = cache.getWhoami();
        return {
            id: uuidV4(),
            label: labels.find(e => e.name === annotation.label),
            taskId,
            polygon: { points: annotation.polygon.points },
            userId: user?.id
        };
    }
};
