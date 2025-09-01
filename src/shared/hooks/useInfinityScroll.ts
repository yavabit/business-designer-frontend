import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    threshold?: number;
    rootMargin?: string;
}

export const useInfiniteScroll = ({
    onLoadMore,
    hasMore,
    isLoading,
    threshold = 0.1,
    rootMargin = "500px 0px",
}: UseInfiniteScrollProps) => {
    const observer = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !isLoading) {
                onLoadMore();
            }
        },
        [hasMore, isLoading, onLoadMore]
    );

    useEffect(() => {
        const element = loadingRef.current;
        if (!element || !hasMore) return;

        observer.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin,
            threshold,
        });

        observer.current.observe(element);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [handleObserver, hasMore, isLoading, rootMargin, threshold]);

    return loadingRef;
};
