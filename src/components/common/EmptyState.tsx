interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12">
      {icon && <div className="mb-4 text-[#D1D1D1]">{icon}</div>}
      <h2 className="text-[#595959] text-lg">{title}</h2>
      {description && (
        <p className="text-sm text-[#999999] mt-2 leading-relaxed max-w-xs break-keep">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
