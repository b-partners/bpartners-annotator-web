import { IEventHandlerProps, IPointInfo, ScalingHandler, getAnnotationsLastColors, getAnnotationsLastLabel } from '.';
import { IAnnotation, IPoint, IPolygon } from '../../context';
import {
    CanvasHandler,
    TMouseType,
    areOverlappingPoints,
    findMidpoint,
    getColorFromMain,
    pointBelongsToOrIsClose,
} from '../../utils';

export const getMousePositionInCanvas = (event: MouseEvent, canvas: HTMLCanvasElement) => {
    const canvasRect = canvas.getBoundingClientRect();
    const currentX = event.clientX - Math.floor(canvasRect?.left || 0);
    const currentY = event.clientY - Math.floor(canvasRect?.top || 0);
    return { x: Math.floor(currentX === -1 ? 0 : currentX), y: Math.floor(currentY === -1 ? 0 : currentY) };
};

export const getRestrictedValue = (value: number, min: number, max: number) =>
    value > max ? max - min : value < min ? 0 : value - min;

export class EventHandler {
    private isAnnotating: boolean;
    private isAdmin: boolean;
    private polygon: IPolygon;
    private annotations: IAnnotation[];
    private canvasHandler: CanvasHandler;
    private drawMouse: (point: IPoint, type: TMouseType) => void;
    private pointsInfo: IPointInfo[] = [];
    private currentPointInfo: IPointInfo | null = null;
    private scalingHandler: ScalingHandler;
    private currentMiddlePosition: (IPointInfo & { annotationIndex: number }) | null = null;

    constructor(props: IEventHandlerProps) {
        this.annotations = props.annotations;
        this.isAnnotating = props.isAnnotating;
        this.canvasHandler = props.canvasHandler;
        this.polygon = props.polygon;
        this.drawMouse = this.canvasHandler.drawMouseCursor();
        this.createPointInfo();
        this.scalingHandler = new ScalingHandler(props.canvas, props.image);
        this.isAdmin = props.isAdmin || false;
    }

    public initEvent = (canvas: HTMLCanvasElement, addAnnotation: (annotation: IAnnotation) => void) => {
        const mouseLeave = this.mouseLeave();
        const escapeKeyDown = this.escapeKeyDown();
        const mouseMove = this.mouseMove;
        const mouseUp = this.mouseUp();

        const mouseDownEventHandler = this.mouseDown(annotation => addAnnotation(annotation));
        canvas.addEventListener('mousemove', mouseMove);
        canvas.addEventListener('mouseleave', mouseLeave);
        if (!this.isAdmin) {
            canvas.addEventListener('mousedown', mouseDownEventHandler);
            canvas.addEventListener('mouseup', mouseUp);
            window.addEventListener('keydown', escapeKeyDown);
        }

        return () => {
            canvas.removeEventListener('mousemove', mouseMove);
            canvas.removeEventListener('mouseleave', mouseLeave);
            if (!this.isAdmin) {
                canvas.removeEventListener('mousedown', mouseDownEventHandler);
                canvas.removeEventListener('mouseup', mouseUp);
                window.removeEventListener('keydown', escapeKeyDown);
            }
        };
    };

    private mouseUp() {
        const canvasHandler = this;
        return () => {
            canvasHandler.currentPointInfo = null;
            canvasHandler.createPointInfo();
        };
    }

    private mouseDown = (end: (annotation: IAnnotation) => void) => (event: MouseEvent) => {
        const sc = this.scalingHandler;

        const polygon = this.polygon;
        const points = polygon.points;

        const currentLogicalPosition = sc.getLogicalPosition(event);
        const currentPhysicalPosition = sc.getPhysicalPositionByEvent(event);

        if (this.isAnnotating && points.length > 1 && areOverlappingPoints(points[0], currentLogicalPosition)) {
            points.push(points[0]);
            this.drawMouse(currentPhysicalPosition, 'DEFAULT');
            const colors = getAnnotationsLastColors(this.annotations);
            if (colors) {
                polygon.fillColor = colors.fillColor;
                polygon.strokeColor = colors.strokeColor;
            }
            end({ label: getAnnotationsLastLabel(this.annotations), polygon: polygon, id: 0 });
            this.draw();
        } else if (this.isAnnotating) {
            points.push(currentLogicalPosition);
            this.draw();
        } else if (!this.isAnnotating) {
            this.currentPointInfo =
                this.pointsInfo.find(value => areOverlappingPoints(value.point, currentLogicalPosition)) || null;
        }

        if (
            !this.currentMiddlePosition &&
            !this.isAnnotating &&
            !this.currentPointInfo &&
            !sc.isPointOutsideOrImage(currentLogicalPosition)
        ) {
            this.isAnnotating = true;
            this.polygon = { ...getColorFromMain('#00ff00'), points: [currentLogicalPosition] };
            this.draw();
        }

        if (this.currentMiddlePosition && !this.currentPointInfo && !this.isAnnotating) {
            const annotationIndex = this.currentMiddlePosition.annotationIndex;
            const pointIndex = this.currentMiddlePosition.index;
            const point = this.currentMiddlePosition.point;

            this.annotations[annotationIndex].polygon.points.splice(pointIndex, 0, point);
            this.currentMiddlePosition = null;
            this.createPointInfo();
            this.draw();
        }
    };

    private mouseMove = (event: MouseEvent) => {
        const sc = this.scalingHandler;

        const currentPhysicalPosition = sc.getPhysicalPositionByEvent(event);
        const currentLogicalPosition = sc.getLogicalPosition(event);

        const isPointInAnnotation = this.pointsInfo.find(value =>
            areOverlappingPoints(value.point, currentLogicalPosition)
        );
        const points = this.polygon.points;

        if (points.length > 0 && areOverlappingPoints(points[0], currentLogicalPosition)) {
            this.drawMouse(currentPhysicalPosition, 'END');
        } else if (!this.isAnnotating && isPointInAnnotation) {
            this.drawMouse(currentPhysicalPosition, 'UNDER_POINT');
        } else if (this.currentMiddlePosition) {
            this.drawMouse(currentPhysicalPosition, 'ADD_POINT');
        } else {
            this.drawMouse(currentPhysicalPosition, 'DEFAULT');
        }

        if (!this.isAnnotating && this.currentPointInfo !== null) {
            const { id, index } = this.currentPointInfo;
            const points = this.annotations[id - 1].polygon.points;
            const lastIndex = points.length - 1;

            if (index === 0 || index === lastIndex) {
                points[lastIndex] = currentLogicalPosition;
                points[0] = currentLogicalPosition;
            } else {
                points[index] = currentLogicalPosition;
            }
            this.draw();
        }

        if (!this.isAnnotating) {
            for (let index = 0; index < this.annotations.length; index++) {
                const annotation = this.annotations[index];
                if (!annotation.isInvisible) {
                    for (let a = 1; a < annotation.polygon.points.length; a++) {
                        const segment = [annotation.polygon.points[a - 1], annotation.polygon.points[a]] as any;
                        const areTooClose = pointBelongsToOrIsClose(currentLogicalPosition, segment);
                        if (areTooClose) {
                            this.currentMiddlePosition = {
                                annotationIndex: index,
                                index: a,
                                point: findMidpoint(segment),
                                id: annotation.polygon.points.length,
                            };
                            return;
                        }

                        this.currentMiddlePosition = null;
                    }
                }
            }
        }
    };

    private escapeKeyDown() {
        const eventHandler = this;
        return (event: KeyboardEvent) => {
            if (eventHandler.isAnnotating && (event.key === 'Escape' || event.key === 'Backspace')) {
                eventHandler.polygon.points.pop();
                if (eventHandler.polygon.points.length === 0) {
                    this.isAnnotating = false;
                    this.currentPointInfo = null;
                }
                eventHandler.draw();
            }
        };
    }

    private mouseLeave() {
        const canvasHandler = this.canvasHandler;
        return () => {
            canvasHandler.removeCursor();
        };
    }

    private draw() {
        const polygonsToDraw = [
            ...(this.annotations.filter(a => !a.isInvisible).map(annotation => annotation.polygon) || []),
            this.polygon,
        ];
        this.canvasHandler.draw(polygonsToDraw);
    }

    private createPointInfo() {
        this.pointsInfo = [];
        this.annotations
            .filter(a => !a.isInvisible)
            .forEach(annotation => {
                annotation.polygon.points.forEach((point, index) => {
                    this.pointsInfo.push({ id: annotation.id, index, point });
                });
            });
    }
}
