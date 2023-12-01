import { Label } from '@bpartners-annotator/typescript-client';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export enum ECanvasAction {
  NO_ACTION = 'NO_ACTION',
  POLYGONE = 'POLYGONE',
}

export interface IPoint {
  x: number;
  y: number;
}
export interface IPolygon {
  fillColor: string;
  strokeColor: string;
  points: IPoint[];
}
export interface IAnnotation {
  label: string;
  polygon: IPolygon;
  id: number;
}

export interface IZoomContext {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export interface IAnnotationContext {
  annotations: IAnnotation[];
  setAnnotations: Dispatch<SetStateAction<IAnnotation[]>>;
  isAnnotating: boolean;
  setIsAnnotating: Dispatch<SetStateAction<boolean>>;
  labels: Label[];
  img: string;
}

export interface ICanvasContext {
  zoom: IZoomContext;
}

export interface ICanvasEditorProviderProps {
  children: ReactNode;
  zoom: IZoomContext;
}

export interface IListPageState {
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}
