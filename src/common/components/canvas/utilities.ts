import { IAnnotation } from '../../context';

export const getAnnotationsLastLabel = (annotations: IAnnotation[]) => {
  if (annotations.length === 0) return '';
  else return annotations[annotations.length - 1].label;
};

export const getAnnotationsLastColors = (annotations: IAnnotation[]) => {
  if (annotations.length === 0) return null;
  const { fillColor, strokeColor } = annotations[annotations.length - 1].polygon;
  return { fillColor, strokeColor };
};
