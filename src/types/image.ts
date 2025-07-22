export interface PictureImage {
  sources: {
    avif: string;
    webp: string;
  };
  img: {
    src: string;
    w: number;
    h: number;
    toString(): string;
  };
  toString(): string;
}