import { useState, useEffect } from 'react';

export function useImageSize(url: string | null) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!url) {
      setSize(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      setSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      setSize(null);
    };
    img.src = url;
  }, [url]);

  return size;
}