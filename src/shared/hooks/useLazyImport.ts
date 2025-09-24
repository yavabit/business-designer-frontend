import { useEffect, useState } from "react";

type ImportFunc<T = unknown> = () => Promise<T>;

interface UseLazyImportOptions {
  eager?: boolean;
}

export const useLazyImport = <T = unknown>(
  imports: ImportFunc<T>[],
  options?: UseLazyImportOptions
) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!options?.eager) return;

    setLoading(true);
    Promise.all(imports.map(fn => fn()))
      .finally(() => setLoading(false));
  }, [imports, options?.eager]);

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(imports.map(fn => fn()));
      return results;
    } finally {
      setLoading(false);
    }
  };

  return { loading, load };
};
