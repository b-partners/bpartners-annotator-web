import { IAnnotation } from '../../context';

export const getAnnotationsLastLabel = (annotations: IAnnotation[]) => {
  if (annotations.length === 0) return '';
  else return annotations[annotations.length - 1].label;
};
