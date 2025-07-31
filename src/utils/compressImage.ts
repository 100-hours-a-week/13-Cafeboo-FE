import imageCompression from 'browser-image-compression';

export async function compressImage(
  file: File,
  maxSizeMB = 1,
  maxWidthOrHeight = 128,
  initialQuality = 0.9
): Promise<File> {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    maxIteration: 10,
    initialQuality,
    fileType: 'image/webp',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    throw error;
  }
}
