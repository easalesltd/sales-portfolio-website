import { useEffect, useRef, useState, type RefObject } from 'react';

const PULL_THRESHOLD = 56;
const MAX_PULL = 88;

type Options = {
  enabled: boolean;
  onRefresh: () => Promise<void>;
};

export function usePullToRefresh({ enabled, onRefresh }: Options): {
  scrollRef: RefObject<HTMLDivElement | null>;
  pullDistance: number;
  refreshing: boolean;
  threshold: number;
} {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const pullDistanceRef = useRef(0);
  const startYRef = useRef(0);
  const pullingRef = useRef(false);
  const refreshingRef = useRef(false);
  const onRefreshRef = useRef(onRefresh);

  onRefreshRef.current = onRefresh;
  refreshingRef.current = refreshing;

  const setPull = (distance: number) => {
    pullDistanceRef.current = distance;
    setPullDistance(distance);
  };

  useEffect(() => {
    if (!enabled) return;

    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (event: TouchEvent) => {
      if (refreshingRef.current || el.scrollTop > 2) return;
      startYRef.current = event.touches[0].clientY;
      pullingRef.current = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!pullingRef.current) return;

      if (el.scrollTop > 2) {
        pullingRef.current = false;
        setPull(0);
        return;
      }

      const delta = event.touches[0].clientY - startYRef.current;
      if (delta > 0) {
        event.preventDefault();
        setPull(Math.min(delta * 0.45, MAX_PULL));
      } else {
        setPull(0);
      }
    };

    const finishPull = () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;

      const distance = pullDistanceRef.current;
      if (distance >= PULL_THRESHOLD && !refreshingRef.current) {
        setRefreshing(true);
        setPull(PULL_THRESHOLD);
        void onRefreshRef.current().finally(() => {
          setRefreshing(false);
          setPull(0);
        });
        return;
      }

      setPull(0);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', finishPull);
    el.addEventListener('touchcancel', finishPull);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', finishPull);
      el.removeEventListener('touchcancel', finishPull);
    };
  }, [enabled]);

  return { scrollRef, pullDistance, refreshing, threshold: PULL_THRESHOLD };
}
