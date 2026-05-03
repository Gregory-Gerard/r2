import { useEffect, useRef, useState } from 'react';

export const useNearViewport = <T extends Element>(rootMargin = '600px') => {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
};
