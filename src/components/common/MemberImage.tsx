import { useImageSize } from '@/hooks/useImageSize';

interface MemberImageProps {
  url: string;
  alt: string;
  className?: string;
}

export default function MemberImage({ url, alt, className }: MemberImageProps) {
  const size = useImageSize(url);

  if (!size) {
    return (
      <div className={`rounded-full bg-gray-200 ${className || ''}`} />
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      width={size.width}
      height={size.height}
      className={`rounded-full object-cover ${className || ''}`}
      loading="lazy"
    />
  );
}
