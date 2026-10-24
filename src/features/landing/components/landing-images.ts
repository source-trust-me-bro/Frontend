const UNSPLASH_BASE = "https://images.unsplash.com/";

export function unsplashImage(
  id: string,
  widths: number[],
  largestWidth = 1600,
): { src: string; srcSet: string } {
  const url = (width: number) =>
    `${UNSPLASH_BASE}${id}?auto=format&fit=crop&w=${width}&q=80`;

  return {
    src: url(largestWidth),
    srcSet: widths.map((width) => `${url(width)} ${width}w`).join(", "),
  };
}
