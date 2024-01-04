import { IAnnotation, IPoint, IPolygon } from '../../context';
import { CanvasHandler, TMouseType } from '../../utils';

export interface ICanvasProps {
    draw: (ctx: CanvasRenderingContext2D) => {};
}
export enum ECanvasAction {
    NONE = 'NONE',
    POLYGONE = 'POLYGONE',
    MOVE = 'MOVE',
}

export interface IImageOffset {
    iwo: number;
    iho: number;
}

export interface IPointInfo {
    id: number;
    index: number;
    point: IPoint;
}

export interface ICanvasMouseDownEventHandlerParams {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    isAnnotating: boolean;
    polygon: IPolygon;
    annotations: IAnnotation[];
    canvasHandler: CanvasHandler;
    end: (annotation: IAnnotation) => void;
    imageOffset: IImageOffset;
    mouseDrawer: (point: IPoint, type: TMouseType) => void;
}

export interface ICanvasMouseMoveEventHandlerParams {
    canvasPolygon: HTMLCanvasElement;
    drawMouse: (p: IPoint, type: TMouseType) => void;
    polygon: IPolygon;
    isAnnotating: boolean;
    annotations: IPointInfo[];
}

export type TCanvasMouseMoveEventHandler = (params: ICanvasMouseMoveEventHandlerParams) => (event: MouseEvent) => void;
export type TCanvasMouseDownEventHandler = (params: ICanvasMouseDownEventHandlerParams) => (event: MouseEvent) => void;

export interface IEventHandlerProps {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    isAnnotating: boolean;
    polygon: IPolygon;
    annotations: IAnnotation[];
    canvasHandler: CanvasHandler;
    imageOffset: IImageOffset;
    isAdmin?: boolean;
}
