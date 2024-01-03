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

    public isPointOutsideOrImage(point: IPoint) {
        const { width, height } = this.image;
        const testingValues = [0, width, height, width - 1, height - 1, width + 1, height + 1];
        return testingValues.includes(Math.round(point.x)) || testingValues.includes(Math.round(point.y));
    }

    public getImageOffset = () => {
        const { ih, iw } = this.getImageSize();
        const { width, height } = this.canvas;
        return { iwo: Math.floor((width - iw) / 2), iho: Math.floor((height - ih) / 2) };
    };

    public getRestrictedValue = (value: number, min: number, max: number) =>
        value > max ? max - min : value < min ? 0 : value - min;

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

    public getRestrictedPhysicalPositionByEvent(event: MouseEvent) {
        const { iho, iwo } = this.getImageOffset();
        const { ih, iw } = this.getImageSize();
        const currentPhysicalPosition = this.getPhysicalPositionByEvent(event);
        currentPhysicalPosition.x = Math.round(this.getRestrictedValue(currentPhysicalPosition.x, iwo, iw + iwo));
        currentPhysicalPosition.y = Math.round(this.getRestrictedValue(currentPhysicalPosition.y, iho, ih + iho));
        return currentPhysicalPosition;
    }

    public getPhysicalPositionByPoint = (point: IPoint) => {
        const { x, y } = this.getScaledUpPosition(point);
        const { iho, iwo } = this.getImageOffset();
        return { x: Math.floor(x + iwo), y: Math.floor(y + iho) };
    };

    public getLogicalPosition(event: MouseEvent) {
        const currentPhysicalRestrictedPosition = this.getRestrictedPhysicalPositionByEvent(event);
        const currentLogicalPosition = this.getScaledDownPosition(currentPhysicalRestrictedPosition);
        return currentLogicalPosition;
    }
}
