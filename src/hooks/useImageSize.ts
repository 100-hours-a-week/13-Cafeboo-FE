import { useState, useEffect } from 'react';

export function useImageSize(url: string | null) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!url) {
      setSize(null);
      return;
    }
    const img = new Image();
  
    const onLoad = () => setSize({ width: img.naturalWidth, height: img.naturalHeight });
    const onError = () => setSize(null);
  
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = url;
  
    return () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
  }, [url]);

  return size;
}