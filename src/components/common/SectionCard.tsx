import React from 'react';

export interface SectionCardProps {
  className?: string;
  children: React.ReactNode;
}

export default function SectionCard({
  className,
  children,
}: SectionCardProps) {
  return (
    <div
      className={`w-full mx-auto bg-white rounded-md shadow-xs border border-[#dadcdf] p-4 ${className}`}
    >
      {children}
    </div>
  );
}