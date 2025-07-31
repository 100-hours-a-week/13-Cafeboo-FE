declare module '*&as=picture' {
  const picture: {
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
  };
  export default picture;
}

declare module '*?format=webp;avif' {
  const src: {
    webp: string;
    avif: string;
  };
  export default src;
}
