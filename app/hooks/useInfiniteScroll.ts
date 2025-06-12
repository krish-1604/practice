import { useRef, useCallback, useEffect } from 'react';
interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (isLoading || !enabled || !node) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold, rootMargin }
    );
    observerRef.current.observe(node);
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin, enabled]);
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);
  return lastElementRef;
}