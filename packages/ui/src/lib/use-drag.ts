import { useRef, type PointerEvent } from 'react';

type Delta = { x: number; y: number };

type Axis = 'x' | 'y' | 'none';

type UseDragOptions = {
  onMove?: (delta: Delta) => void;
  onEnd?: (delta: Delta) => void;
  axisLockThreshold?: number;
};

type DragState = {
  x: number;
  y: number;
  pointerId: number;
  axis: Axis;
};

export const useDrag = ({ onMove, onEnd, axisLockThreshold = 10 }: UseDragOptions) => {
  const start = useRef<DragState | null>(null);

  // Once a direction crosses the threshold, lock the gesture to that axis and zero the other
  // until release. Prevents diagonal drift between horizontal nav and vertical close.
  const project = (state: DragState, rawX: number, rawY: number): Delta => {
    if (
      state.axis === 'none' &&
      (Math.abs(rawX) >= axisLockThreshold || Math.abs(rawY) >= axisLockThreshold)
    ) {
      state.axis = Math.abs(rawX) >= Math.abs(rawY) ? 'x' : 'y';
    }

    if (state.axis === 'x') {
      return { x: rawX, y: 0 };
    }

    if (state.axis === 'y') {
      return { x: 0, y: rawY };
    }

    return { x: rawX, y: rawY };
  };

  return {
    onPointerDown: (event: PointerEvent) => {
      // Touch only: mouse and pen don't trigger drag (avoids click-and-drag on desktop).
      if (event.pointerType !== 'touch') {
        return;
      }

      start.current = {
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
        axis: 'none',
      };

      // Keep receiving move/up even if the finger drifts off the element.
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: PointerEvent) => {
      // Ignore secondary touches once a gesture is in progress.
      if (!start.current || event.pointerId !== start.current.pointerId) {
        return;
      }

      const delta = project(
        start.current,
        event.clientX - start.current.x,
        event.clientY - start.current.y,
      );

      onMove?.(delta);
    },
    onPointerUp: (event: PointerEvent) => {
      if (!start.current || event.pointerId !== start.current.pointerId) {
        return;
      }

      const delta = project(
        start.current,
        event.clientX - start.current.x,
        event.clientY - start.current.y,
      );

      start.current = null;
      onEnd?.(delta);
    },
    onPointerCancel: (event: PointerEvent) => {
      if (start.current?.pointerId === event.pointerId) {
        start.current = null;
      }
    },
  };
};
