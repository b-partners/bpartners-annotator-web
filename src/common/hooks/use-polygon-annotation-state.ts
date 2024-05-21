import { AnnotationBatch } from '@bpartners-annotator/typescript-client';
import { Polygon } from '@bpartners/annotator-component';
import { Dispatch, SetStateAction, useReducer } from 'react';
import { getLastCreatedAnnotationBatch } from '../../router/loaders';
import { IAnnotation } from '../context';
import { PolygonAnnotationMapper, annotationsMapper } from '../mappers';

const ANNOTATION_WITHOUT_BATCH = 'without-batch';

enum ActionTypes {
    setPolygons,
    setAnnotations,
    setAnnotationBatch,
    setAnnotationBatchs,
}

interface State {
    annotationHistory: Record<string, IAnnotation[]>;
    polygons: Polygon[];
    annotationBatch: AnnotationBatch | undefined;
    annotationBatchs: AnnotationBatch[];
    annotations: IAnnotation[];
}

type Dispatcher = {
    [K in keyof Omit<State, 'annotationHistory'>]?: State[K];
} & {
    annotations?: IAnnotation[];
};

interface Action {
    type: ActionTypes;
    dispatch: Dispatcher;
}

const getPolygonsFromAnnotations = (annotations: IAnnotation[] = []) =>
    annotations.map(PolygonAnnotationMapper.annotationToPolygon);

const getAnnotationHistoryFromAnnotationBatchs = (annotationBatchs: AnnotationBatch[] | null) => {
    const annotations: Record<string, IAnnotation[]> = {};
    (annotationBatchs || []).forEach(ab => {
        annotations[ab.id || ''] =
            ab?.annotations?.map((annotation, key) => annotationsMapper.toDomain(annotation, key + 1)) || [];
    });
    return annotations;
};

const reducer = (state: State, action: Action): State => {
    const historyKey = state.annotationBatch?.id || ANNOTATION_WITHOUT_BATCH;
    const currentAnnotations = state.annotationHistory[historyKey];
    const { dispatch, type } = action;

    const updateHistory = (value: State['annotationHistory'][keyof State['annotationHistory']], key?: string) => {
        return {
            ...state.annotationHistory,
            [key || historyKey]: value,
        };
    };

    if (type === ActionTypes.setAnnotationBatch) {
        const key = dispatch.annotationBatch?.id || ANNOTATION_WITHOUT_BATCH;
        const annotations = state.annotationHistory[key];

        return {
            ...state,
            annotations,
            annotationBatch: dispatch.annotationBatch,
            polygons: getPolygonsFromAnnotations(annotations),
        };
    }

    if (type === ActionTypes.setAnnotations) {
        const annotationHistory = updateHistory(dispatch.annotations || []);
        return {
            ...state,
            annotationHistory,
            annotations: annotationHistory[historyKey],
            polygons: getPolygonsFromAnnotations(dispatch.annotations || []),
        };
    }

    if (type === ActionTypes.setPolygons) {
        const newAnnotations = PolygonAnnotationMapper.polygonsToAnnotations(
            currentAnnotations,
            dispatch.polygons || []
        );
        const annotationHistory = updateHistory(newAnnotations);
        return {
            ...state,
            polygons: dispatch.polygons || [],
            annotationHistory: annotationHistory,
            annotations: annotationHistory[historyKey],
        };
    }

    if (type === ActionTypes.setAnnotationBatchs) {
        const annotationBatchs = dispatch.annotationBatchs || [];
        const annotationBatch = getLastCreatedAnnotationBatch(annotationBatchs) || undefined;
        const annotationHistory = getAnnotationHistoryFromAnnotationBatchs(annotationBatchs);
        const annotations = annotationHistory[annotationBatch?.id || ANNOTATION_WITHOUT_BATCH] || [];
        const polygons = getPolygonsFromAnnotations(annotations);
        return {
            annotationBatchs,
            annotationBatch,
            annotationHistory,
            annotations,
            polygons,
        };
    }

    return state;
};

export const usePolygonAnnotationState = () => {
    const historyKey = ANNOTATION_WITHOUT_BATCH;
    const currentAnnotationHistory = {
        [ANNOTATION_WITHOUT_BATCH]: [] as IAnnotation[],
        ...getAnnotationHistoryFromAnnotationBatchs([]),
    };
    const initialState = {
        annotationBatch: {},
        annotationHistory: currentAnnotationHistory,
        polygons: [],
        annotationBatchs: [],
        annotations: (currentAnnotationHistory as State['annotationHistory'])[historyKey],
    };
    const [state, dispatcher] = useReducer<typeof reducer, State>(reducer, initialState, a => ({
        ...a,
        polygons: getPolygonsFromAnnotations(a.annotations),
    }));

    const { polygons, annotationBatch, annotationHistory, annotations = [] } = state;

    const setAnnotations: Dispatch<SetStateAction<IAnnotation[]>> = params => {
        let newAnnotations: IAnnotation[] = [];
        if (typeof params === 'function') {
            newAnnotations = params(annotationHistory[historyKey]);
        } else {
            newAnnotations = params;
        }
        dispatcher({
            type: ActionTypes.setAnnotations,
            dispatch: {
                annotations: newAnnotations,
            },
        });
    };

    const setPolygons = (polygons: Polygon[]) => {
        dispatcher({
            type: ActionTypes.setPolygons,
            dispatch: {
                polygons: polygons,
            },
        });
    };

    const setBatchAnnotation = (batch: AnnotationBatch) => {
        dispatcher({
            type: ActionTypes.setAnnotationBatch,
            dispatch: {
                annotationBatch: batch,
            },
        });
    };

    const setBatchAnnotations = (annotationBatchs: AnnotationBatch[]) => {
        dispatcher({
            type: ActionTypes.setAnnotationBatchs,
            dispatch: {
                annotationBatchs,
            },
        });
    };

    return {
        setAnnotations,
        setPolygons,
        setBatchAnnotation,
        setBatchAnnotations,
        annotationBatchs: state.annotationBatchs || [],
        annotationBatch,
        annotations,
        polygons,
    };
};
