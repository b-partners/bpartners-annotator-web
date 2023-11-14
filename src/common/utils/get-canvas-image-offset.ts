export const getCanvasImageOffset = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const iwo = Math.floor((canvas.width - image.width) / 2);
  const iho = Math.floor((canvas.height - image.height) / 2);
  return { iwo, iho };
};
