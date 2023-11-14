import { IEventHandlerProps, IImageOffset, IPointInfo } from '.';
import { IAnnotation, IPoint, IPolygon } from '../../context';
import { CanvasHandler, TMouseType, areOverlappingPoints } from '../../utils';

export const getMousePositionInCanvas = (event: MouseEvent, canvas: HTMLCanvasElement) => {
  const canvasRect = canvas.getBoundingClientRect();
  const scale = parseInt(canvas.style.width) / canvas.width;

  const currentX = event.clientX - Math.floor(canvasRect?.left || 0);
  const currentY = event.clientY - Math.floor(canvasRect?.top || 0);
  return { x: Math.floor((currentX === -1 ? 0 : currentX) / scale), y: Math.floor((currentY === -1 ? 0 : currentY) / scale) };
};

export const getRestrictedValue = (value: number, min: number, max: number) => (value > max ? max - min : value < min ? 0 : value - min);

export class EventHandler {
  private canvas: HTMLCanvasElement;
  private image: HTMLImageElement;
  private isAnnotating: boolean;
  private polygon: IPolygon;
  private annotations: IAnnotation[];
  private canvasHandler: CanvasHandler;
  private imageOffset: IImageOffset;
  private drawMouse: (point: IPoint, type: TMouseType) => void;
  private pointsInfo: IPointInfo[] = [];
  private currentPointInfo: IPointInfo | null = null;

  constructor(props: IEventHandlerProps) {
    this.canvas = props.canvas;
    this.annotations = props.annotations;
    this.image = props.image;
    this.isAnnotating = props.isAnnotating;
    this.canvasHandler = props.canvasHandler;
    this.imageOffset = props.imageOffset;
    this.polygon = props.polygon;
    this.drawMouse = this.canvasHandler.drawMouseCursor();
    this.createPointInfo();
  }

  public initEvent = (canvas: HTMLCanvasElement, addAnnotation: (annotation: IAnnotation) => void) => {
    const mouseLeave = this.mouseLeave();
    const escapeKeyDown = this.escapeKeyDown();
    const mouseMove = this.mouseMove;
    const mouseUp = this.mouseUp();

    const mouseDownEventHandler = this.mouseDown(annotation => addAnnotation(annotation));
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('mousedown', mouseDownEventHandler);
    canvas.addEventListener('mouseup', mouseUp);
    canvas.addEventListener('mouseleave', mouseLeave);
    window.addEventListener('keydown', escapeKeyDown);

    return () => {
      canvas.removeEventListener('mousemove', mouseMove);
      canvas.removeEventListener('mousedown', mouseDownEventHandler);
      canvas.removeEventListener('mouseup', mouseUp);
      canvas.removeEventListener('mouseleave', mouseLeave);
      window.removeEventListener('keydown', escapeKeyDown);
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
    const polygon = this.polygon;
    const points = polygon.points;

    if (this.isAnnotating) {
      const position = this.getMousePositionWithOffset(event);
      if (points.length > 1 && areOverlappingPoints(points[0], position)) {
        points.push(points[0]);
        this.drawMouse(this.realPointPosition(position), 'DEFAULT');
        end({ label: '', polygon: polygon, id: 0 });
      } else {
        points.push(position);
      }
      this.draw();
    } else {
      const currentPosition = this.getMousePositionWithOffset(event);
      this.currentPointInfo = this.pointsInfo.find(value => areOverlappingPoints(value.point, currentPosition)) || null;
    }
  };

  private mouseMove = (event: MouseEvent) => {
    const currentPosition = getMousePositionInCanvas(event, this.canvas);
    const isPointInAnnotation = this.pointsInfo.find(value => areOverlappingPoints(this.realPointPosition(value.point), currentPosition));
    const points = this.polygon.points;

    if (points.length > 0 && areOverlappingPoints(this.realPointPosition(points[0]), currentPosition)) {
      this.drawMouse(currentPosition, 'END');
    } else if (!this.isAnnotating && isPointInAnnotation) {
      this.drawMouse(currentPosition, 'UNDER_POINT');
    } else {
      this.drawMouse(currentPosition, 'DEFAULT');
    }

    if (!this.isAnnotating && this.currentPointInfo !== null) {
      const { id, index } = this.currentPointInfo;
      const points = this.annotations[id - 1].polygon.points;
      const lastIndex = points.length - 1;
      const position = this.getMousePositionWithOffset(event);
      if (index === 0 || index == lastIndex) {
        points[lastIndex] = position;
        points[0] = position;
      } else {
        points[index] = position;
      }
      this.draw();
    }
  };

  private escapeKeyDown() {
    const eventHandler = this;
    return (event: KeyboardEvent) => {
      if (eventHandler.isAnnotating && event.key === 'Escape') {
        eventHandler.polygon.points.pop();
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

  private realPointPosition({ x, y }: IPoint) {
    return {
      x: x + this.imageOffset.iwo,
      y: y + this.imageOffset.iho,
    };
  }

  private getMousePositionWithOffset(event: MouseEvent) {
    const { iho, iwo } = this.imageOffset;
    const position = getMousePositionInCanvas(event, this.canvas);
    position.x = getRestrictedValue(position.x, iwo, this.image.width + iwo);
    position.y = getRestrictedValue(position.y, iho, this.image.height + iho);
    return position;
  }

  private draw() {
    const polygonsToDraw = [...(this.annotations.map(annotation => annotation.polygon) || []), this.polygon];
    this.canvasHandler.draw(polygonsToDraw);
  }

  private createPointInfo() {
    this.annotations.forEach(annotation => {
      annotation.polygon.points.forEach((point, index) => {
        this.pointsInfo.push({ id: annotation.id, index, point });
      });
    });
  }
}
