import { ResponsiveFontSizesParams } from '.';

export const remToPx = (value: string) => Math.round(parseFloat(value) * 16);

export const pxToRem = (value: number) => `${value / 16}rem`;

export const responsiveFontSizes = ({ sm, md, lg }: ResponsiveFontSizesParams) => ({
    '@media (min-width:600px)': {
        fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
        fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
        fontSize: pxToRem(lg),
    },
});
