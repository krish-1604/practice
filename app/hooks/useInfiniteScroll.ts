import { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll<T extends HTMLElement = HTMLElement>({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback((node: T | null) => {
    if (isLoading || !enabled) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasMore, onLoadMore, threshold, rootMargin, enabled]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
}

interface UseAdvancedInfiniteScrollOptions extends UseInfiniteScrollOptions {
  debounceMs?: number;
  retryCount?: number;
  onError?: (error: Error) => void;
}

export function useAdvancedInfiniteScroll<T extends HTMLElement = HTMLElement>({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true,
  debounceMs = 100,
  retryCount = 3,
  onError
}: UseAdvancedInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  const debouncedLoadMore = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(async () => {
      try {
        await onLoadMore();
        retryCountRef.current = 0;
      } catch (error) {
        retryCountRef.current++;
        if (retryCountRef.current < retryCount) {
          setTimeout(() => debouncedLoadMore(), Math.pow(2, retryCountRef.current) * 1000);
        } else if (onError) {
          onError(error as Error);
        }
      }
    }, debounceMs);
  }, [onLoadMore, debounceMs, retryCount, onError]);

  const lastElementRef = useCallback((node: T | null) => {
    if (isLoading || !enabled) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          debouncedLoadMore();
        }
      },
      {
        threshold,
        rootMargin
      }
    );
    
    if (node) {
      observerRef.current.observe(node);
    }
  }, [isLoading, hasMore, debouncedLoadMore, threshold, rootMargin, enabled]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0;
  }, []);

  return {
    lastElementRef,
    resetRetryCount,
    currentRetryCount: retryCountRef.current
  };
}