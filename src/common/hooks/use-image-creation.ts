'use client';
import { useEffect, useState } from 'react';

export const useImageCreation = (src: string) => {
    const [image, setImage] = useState<HTMLImageElement>(new Image());

    useEffect(() => {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = src;
    }, [src]);

    return { image, imgHeight: image?.height || 0, imgWidth: image?.width || 0 };
};
