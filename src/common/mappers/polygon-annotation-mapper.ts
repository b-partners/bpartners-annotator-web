import { Polygon } from '@bpartners/annotator-component';
import { IAnnotation } from '../context';

export class PolygonAnnotationMapper {
    public static annotationToPolygon = (annotation: IAnnotation): Polygon => {
        const { isInvisible, polygon, uuid } = annotation || {};
        return {
            fillColor: polygon.fillColor || '',
            strokeColor: polygon.strokeColor || '',
            id: uuid || '',
            isInvisible,
            points: polygon.points,
        };
    };

    public static polygonsToAnnotations = (annotations: IAnnotation[], polygons: Polygon[]) => {
        return polygons.map(({ fillColor, id: polygonId, points, strokeColor }, i) => {
            const annotation: IAnnotation =
                annotations.find(a => a.uuid === polygonId) || ({ label: '', id: i } as any);
            annotation.uuid = polygonId;
            annotation.polygon = {
                fillColor,
                points,
                strokeColor,
            };

            if (annotation.label === '' && i !== 0) {
                annotation.label = annotations[i - 1].label;
            }

            return annotation;
        });
    };
}
