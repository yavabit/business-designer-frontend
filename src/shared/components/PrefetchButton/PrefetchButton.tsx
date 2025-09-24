import { useLazyImport } from "@hooks/useLazyImport";
import { type MouseEventHandler } from "react";

interface PrefetchButtonProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  prefetchImport?: () => Promise<unknown>;
  children: React.ReactNode;
  className?: string;
}

export const PrefetchButton = ({
  onClick,
  prefetchImport,
  children,
  className,
}: PrefetchButtonProps) => {
  const { load } = useLazyImport([prefetchImport ?? (() => Promise.resolve())], { eager: false });

  const handleHover = () => {
    if (prefetchImport) {
		load();
	}
  };

  return (
    <div
      className={className}
      onMouseEnter={handleHover}
      onFocus={handleHover}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
