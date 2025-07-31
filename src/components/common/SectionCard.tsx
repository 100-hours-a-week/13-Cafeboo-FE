import React from 'react';

export interface SectionCardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function SectionCard({
  className,
  children,
  onClick,
}: SectionCardProps) {
  return (
    <div
      className={`w-full mx-auto bg-white rounded-md border border-[#d0ced3] p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
