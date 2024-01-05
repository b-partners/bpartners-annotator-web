export const getCanvasImageOffset = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const currentUrl = window.location.href;
    const urlSearchParams = new URL(currentUrl);

    const scale = +(urlSearchParams.searchParams.get('scale') || '1');

    const iw = Math.floor(image.width * scale);
    const ih = Math.floor(image.height * scale);

    const iwo = Math.floor((canvas.width - image.width * scale) / 2);
    const iho = Math.floor((canvas.height - image.height * scale) / 2);
    return { iwo, iho, iw, ih };
};
