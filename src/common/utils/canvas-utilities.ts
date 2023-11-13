import { IPoint } from '../context';

const OVERLAPPING_MARGIN = 2;
export const isBetween = (value: number, ref: number) => value >= ref - OVERLAPPING_MARGIN && value <= ref + OVERLAPPING_MARGIN;

export const areOverlappingPoints = (under: IPoint, upper: IPoint) => {
  const isXValid = isBetween(upper.x, under.x);
  const isYValid = isBetween(upper.y, under.y);

  return isXValid && isYValid;
};

export const getColorFromMain = (main: string) => {
  return {
    fillColor: `${main}40`,
    strokeColor: main,
  };
};
