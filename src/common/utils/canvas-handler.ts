import { RefObject } from 'react';
import { TMouseType, getCanvasImageOffset } from '.';
import { ScalingHandler } from '../components/canvas';
import { IPoint, IPolygon } from '../context';

export class CanvasHandler {
    private _canvasPolygonRef: RefObject<HTMLCanvasElement>;
    private _canvasImageRef: RefObject<HTMLCanvasElement>;
    private _canvasCursorRef: RefObject<HTMLCanvasElement>;

    private _polygonCtx: CanvasRenderingContext2D = null as any;
    private _imageCtx: CanvasRenderingContext2D = null as any;
    private _cursorCtx: CanvasRenderingContext2D = null as any;

    private _image: HTMLImageElement;

    private _cw: number = 0;
    private _ch: number = 0;

    private _iwo: number = 0;
    private _iho: number = 0;

    private _scalingHandler: ScalingHandler;

    constructor(
        canvasPolygon: RefObject<HTMLCanvasElement>,
        canvasImage: RefObject<HTMLCanvasElement>,
        canvasCursor: RefObject<HTMLCanvasElement>,
        image: HTMLImageElement
    ) {
        this._canvasPolygonRef = canvasPolygon;
        this._canvasImageRef = canvasImage;
        this._canvasCursorRef = canvasCursor;
        this._image = image;
        this.init();
        this._scalingHandler = new ScalingHandler(canvasCursor.current as any, image);
    }

    private _initializeSize() {
        if (this._canvasCursorRef.current && this._image) {
            const canvas = this._canvasCursorRef.current,
                image = this._image;
            this._scalingHandler = new ScalingHandler(canvas, this._image);
            this._cw = canvas.width;
            this._ch = canvas.height;
            const { iwo, iho } = getCanvasImageOffset(canvas, image);
            this._iwo = iwo;
            this._iho = iho;
        }
    }

    public removeCursor = () => {
        const canvasHandler = this;
        return (() => canvasHandler.clear(this._cursorCtx))();
    };

    public drawMouseCursor() {
        const ctx = this._cursorCtx;
        const clear = () => this.clear(ctx);
        return ({ x, y }: IPoint, type: TMouseType) => {
            if (ctx) {
                clear();
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (type === 'DEFAULT') {
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (type === 'END') {
                    ctx.arc(x, y, 7, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (type === 'ADD_POINT') {
                    const size = 5;
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y - size);
                    ctx.lineTo(x, y + size);
                    ctx.lineTo(x, y);
                    ctx.lineTo(x - size, y);
                    ctx.lineTo(x + size, y);
                    ctx.stroke();
                } else {
                    ctx.arc(x, y, 7, 0, Math.PI * 2);
                    ctx.stroke();
                }
                ctx.closePath();
            }
        };
    }

    private _initCtx() {
        if (this._canvasCursorRef.current && this._canvasImageRef.current && this._canvasPolygonRef.current) {
            const polygon = this._canvasPolygonRef.current;
            const image = this._canvasImageRef.current;
            const cursor = this._canvasCursorRef.current;
            this._polygonCtx = polygon.getContext('2d') as any;
            this._imageCtx = image.getContext('2d') as any;
            this._cursorCtx = cursor.getContext('2d') as any;
        }
    }

    public init() {
        this._initializeSize();
        this._initCtx();
        if (this._polygonCtx && this._image) {
            this.clear(this._polygonCtx);
            const scale = this._scalingHandler.getScale();
            this._imageCtx.drawImage(
                this._image,
                this._iwo,
                this._iho,
                this._image.width * scale,
                this._image.height * scale
            );
        }
    }

    private clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this._cw, this._ch);
    }

    private drawPoint(point: IPoint, ctx: CanvasRenderingContext2D) {
        const sc = this._scalingHandler;
        const { x, y } = sc.getPhysicalPositionByPoint(point);

        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    private drawPoints(points: IPoint[]) {
        const sc = this._scalingHandler;
        if (!!this._polygonCtx && points.length > 0) {
            const ctx = this._polygonCtx;
            const { x: x0, y: y0 } = sc.getPhysicalPositionByPoint(points[0]);
            ctx.moveTo(x0, y0);
            points.slice(1).forEach(point => {
                const { x, y } = sc.getPhysicalPositionByPoint(point);
                ctx.lineTo(x, y);
            });
        }
    }

    draw(polygons: IPolygon[]) {
        if (this._polygonCtx) {
            const ctx = this._polygonCtx;
            this.clear(ctx);
            polygons.forEach(polygon => {
                ctx.strokeStyle = polygon.strokeColor;
                ctx.fillStyle = polygon.fillColor;
                ctx.lineWidth = 1;
                ctx.beginPath();
                this.drawPoints(polygon.points);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ctx.strokeStyle = polygon.strokeColor;
                ctx.fillStyle = polygon.strokeColor;
                polygon.points.forEach(point => this.drawPoint(point, ctx));
            });
        }
    }
}
