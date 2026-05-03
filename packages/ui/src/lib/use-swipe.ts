import { useRef, type PointerEvent } from 'react';

type UseSwipeOptions = {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
  threshold?: number;
};

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  onSwipeUp,
  threshold = 50,
}: UseSwipeOptions) => {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      return;
    }

    start.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!start.current) {
      return;
    }

    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;

    start.current = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < threshold) {
      return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }

      return;
    }

    if (dy > 0) {
      onSwipeDown?.();
    } else {
      onSwipeUp?.();
    }
  };

  const onPointerCancel = () => {
    start.current = null;
  };

  return { onPointerDown, onPointerUp, onPointerCancel };
};
