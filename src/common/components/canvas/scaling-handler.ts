import { IPoint } from '../../context';

export class ScalingHandler {
  private canvas: HTMLCanvasElement;
  private image: HTMLImageElement;

  constructor(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    this.canvas = canvas;
    this.image = image;
  }

  public getScale = () => this.canvas.width / (window.innerWidth * 0.7);

  public getImageSize = () => {
    const scale = this.getScale();
    const { width, height } = this.image;

    return { iw: Math.floor(width * scale), ih: Math.floor(height * scale) };
  };

  public getImageOffset = () => {
    const { ih, iw } = this.getImageSize();
    const { width, height } = this.canvas;
    return { iwo: Math.floor((width - iw) / 2), iho: Math.floor((height - ih) / 2) };
  };

  public getRestrictedValue = (value: number, min: number, max: number) => (value > max ? max - min : value < min ? 0 : value - min);

  private getScaledUpPosition = ({ x, y }: IPoint) => {
    const scale = this.getScale();
    return { x: x * scale, y: y * scale };
  };

  private getScaledDownPosition = ({ x, y }: IPoint) => {
    const scale = this.getScale();
    return { x: x / scale, y: y / scale };
  };

  public getPhysicalPositionByEvent = (event: MouseEvent) => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const x = event.clientX - Math.floor(canvasRect?.left || 0);
    const y = event.clientY - Math.floor(canvasRect?.top || 0);
    return { x, y };
  };

  public getPhysicalPositionByPoint = (point: IPoint) => {
    const { x, y } = this.getScaledUpPosition(point);
    const { iho, iwo } = this.getImageOffset();
    return { x: x + iwo, y: y + iho };
  };

  public getLogicalPosition(event: MouseEvent) {
    const { iho, iwo } = this.getImageOffset();
    const { ih, iw } = this.getImageSize();

    const currentPhysicalPosition = this.getPhysicalPositionByEvent(event);
    const currentLogicalPosition = this.getScaledDownPosition(currentPhysicalPosition);

    currentLogicalPosition.x = this.getRestrictedValue(currentLogicalPosition.x, iwo, iw + iwo);
    currentLogicalPosition.y = this.getRestrictedValue(currentLogicalPosition.y, iho, ih + iho);

    return currentLogicalPosition;
  }
}
