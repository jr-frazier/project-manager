import clsx from "clsx";

export default function GlassPane({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        " glass rounded-2xl border-solid border-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
}
