import { RefObject } from 'react';
import { TMouseType, getCanvasImageOffset } from '.';
import { IPoint, IPolygon } from '../context';

const POINT_SHAPE_RADIUS = 3;

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
  }

  private _getScalingValue(canvas: RefObject<HTMLCanvasElement>) {
    return (canvas.current?.width || 1) / (window.innerWidth * 0.7);
  }

  private _initializeSize() {
    if (this._canvasCursorRef.current && this._image) {
      const canvas = this._canvasCursorRef.current,
        image = this._image;
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
    const getScale = () => this._getScalingValue(this._canvasCursorRef);
    return ({ x, y }: IPoint, type: TMouseType) => {
      const scale = getScale() > 1 ? getScale() / 2 : getScale();
      if (ctx) {
        clear();
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (type === 'DEFAULT') {
          ctx.arc(x, y, 4 * scale, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === 'END') {
          ctx.arc(x, y, 7 * scale, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.arc(x, y, 7 * scale, 0, Math.PI * 2);
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
      const scale = this._getScalingValue(this._canvasCursorRef);
      this._imageCtx.drawImage(this._image, this._iwo, this._iho, this._image.width * scale, this._image.height * scale);
    }
  }

  private clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this._cw, this._ch);
  }

  private drawPoint({ x, y }: IPoint, ctx: CanvasRenderingContext2D) {
    const scale = this._getScalingValue(this._canvasImageRef);
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.arc(x, y, POINT_SHAPE_RADIUS * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  private drawPoints(points: IPoint[]) {
    if (!!this._polygonCtx && points.length > 0) {
      const ctx = this._polygonCtx;
      const { x: x0, y: y0 } = this.realPointPosition(points[0]);
      ctx.moveTo(x0, y0);
      points.slice(1).forEach(point => {
        const { x, y } = this.realPointPosition(point);
        ctx.lineTo(x, y);
      });
    }
  }

  private realPointPosition({ x, y }: IPoint) {
    if (this._canvasCursorRef.current) {
      const { iwo, iho } = getCanvasImageOffset(this._canvasCursorRef.current, this._image);
      const scale = this._getScalingValue(this._canvasCursorRef);
      return {
        x: scale * x + iwo,
        y: scale * y + iho,
      };
    }
    return {
      x: x + this._iwo,
      y: y + this._iho,
    };
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
        polygon.points.forEach(point => this.drawPoint(this.realPointPosition(point), ctx));
      });
    }
  }
}
