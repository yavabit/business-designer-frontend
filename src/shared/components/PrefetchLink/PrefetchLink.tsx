import { Link, type LinkProps } from "react-router-dom";
import { useLazyImport } from "@hooks/useLazyImport";

interface PrefetchLinkProps extends Omit<LinkProps, "prefetch"> {
  prefetchImport: () => Promise<unknown>;
}

export const PrefetchLink = ({ prefetchImport, ...props }: PrefetchLinkProps) => {
  const { load } = useLazyImport([prefetchImport], { eager: false });

  const handleHover = () => {
    load();
  };

  return (
    <Link
      {...props}
      onMouseEnter={(e) => {
        handleHover();
        props.onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        handleHover();
        props.onFocus?.(e);
      }}
    />
  );
};
