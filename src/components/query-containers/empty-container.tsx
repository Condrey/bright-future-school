interface EmptyContainerProps {
  message: String;
  children?: React.ReactNode;
}
export default function EmptyContainer({
  message,
  children,
}: EmptyContainerProps) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4">
      <p className="max-w-sm text-center text-muted-foreground">{message}</p>
      {children}
    </div>
  );
}
