import { AnnotationBatch, AnnotationReview, Label } from '@bpartners-annotator/typescript-client';
import { FC, ReactNode, createContext, useContext, useState } from 'react';
import { IAnnotation, IAnnotationContext } from '.';
import { annotationsMapper } from '../mappers';
import { getColorFromMain } from '../utils';

const CanvasAnnotationContext = createContext<IAnnotationContext>({
    annotations: [],
    setAnnotations: () => {},
    isAnnotating: false,
    setIsAnnotating: () => {},
    labels: [],
    img: '',
    batchId: '',
    annotationsReviews: [],
    globalReviews: [],
});

export const CanvasAnnotationProvider: FC<{
    children: ReactNode;
    labels: Label[];
    img: string;
    batch?: AnnotationBatch;
    globalReviews?: AnnotationReview[];
    annotationsReviews?: AnnotationReview[];
}> = ({ children, labels, img, batch, annotationsReviews = [], globalReviews = [] }) => {
    const annotation = batch?.annotations?.map((annotation, key) => annotationsMapper.toDomain(annotation, key + 1));

    const [annotations, setAnnotations] = useState<IAnnotation[]>(annotation || []);
    const [isAnnotating, setIsAnnotating] = useState(false);

    return (
        <CanvasAnnotationContext.Provider
            value={{
                annotations,
                setAnnotations,
                isAnnotating,
                setIsAnnotating,
                labels,
                img,
                batchId: batch?.id || '',
                annotationsReviews,
                globalReviews,
            }}
        >
            {children}
        </CanvasAnnotationContext.Provider>
    );
};

export const useCanvasAnnotationContext = () => {
    const context = useContext(CanvasAnnotationContext);

    const findAnnotationIndexById = (id: number) => {
        const currentAnnotations = context.annotations.slice();
        return currentAnnotations.findIndex(value => value.id === id);
    };

    const changeAnnotationLabel = (id: number, label: Label) => {
        const index = findAnnotationIndexById(id);
        const annotations = context.annotations.slice();
        annotations[index].label = label.name || '';
        const color = getColorFromMain(label.color || '#00ff00');
        annotations[index].polygon.fillColor = color.fillColor;
        annotations[index].polygon.strokeColor = color.strokeColor;
        context.setAnnotations(annotations as IAnnotation[]);
    };

    const changeAnnotationColor = (id: number, newColor: string) => {
        const index = findAnnotationIndexById(id);
        const annotations = context.annotations.slice();
        const { fillColor, strokeColor } = getColorFromMain(newColor);
        annotations[index].polygon.fillColor = fillColor;
        annotations[index].polygon.strokeColor = strokeColor;
        context.setAnnotations(annotations as IAnnotation[]);
    };

    const removeAnnotation = (id: number) => {
        const index = findAnnotationIndexById(id);
        const annotations = context.annotations.slice();
        annotations.splice(index, 1);
        context.setAnnotations(annotations as IAnnotation[]);
    };

    const addAnnotation = (annotation: IAnnotation) => {
        const annotations = [...context.annotations.slice(), { ...annotation, id: 1, label: 'Label 1' }];
        const len = context.annotations.length;
        if (len !== 0) {
            const id = annotations[len - 1].id + 1;
            annotations[len].id = id;
            annotations[len].label = annotation.label || '';
        }
        context.setAnnotations(annotations);
    };

    return { ...context, changeAnnotationLabel, changeAnnotationColor, removeAnnotation, addAnnotation };
};
