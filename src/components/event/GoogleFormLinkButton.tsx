import { ExternalLink } from 'lucide-react';

interface GoogleFormLinkProps {
  url?: string;
  label?: string;
  className?: string;
}

export default function GoogleFormLink({
  url = 'https://docs.google.com/forms/d/e/1FAIpQLSd9uO4jDGWUFXELv8mEUGKLzwam9wEjJRfAgPbtTvXYIxw3tA/viewform?usp=sharing',
  label = '구글폼 작성하기',
  className = '',
}: GoogleFormLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 text-sm underline hover:text-blue-800 ${className}`}
    >
      <ExternalLink className="w-4 h-4" />
      {label}
    </a>
  );
}
