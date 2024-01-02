export const getCanvasImageOffset = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const scale = canvas.width / (window.innerWidth * 0.7);

    const iw = Math.floor(image.width * scale);
    const ih = Math.floor(image.height * scale);

    const iwo = Math.floor((canvas.width - image.width * scale) / 2);
    const iho = Math.floor((canvas.height - image.height * scale) / 2);
    return { iwo, iho, iw, ih };
};
