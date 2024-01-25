import { ReactNode } from 'react';
import { IAnnotation } from '../../context';

export interface IAnnotationItemProps {
    annotation: IAnnotation;
    selectLabel?: ReactNode;
}

export interface IInputPickerProps {
    annotation: IAnnotation;
}
