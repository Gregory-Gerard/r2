import { useCallback, useRef, useState, type PointerEvent } from 'react';

type Point = { x: number; y: number };

type Delta = { x: number; y: number };

type Axis = 'x' | 'y' | 'none';

type Zoom = { scale: number; tx: number; ty: number; animating: boolean };

type Mode =
  | { type: 'idle' }
  | { type: 'swipe'; pointerId: number; startX: number; startY: number; axis: Axis }
  | {
      type: 'pan';
      pointerId: number;
      startX: number;
      startY: number;
      baseTx: number;
      baseTy: number;
    }
  | {
      type: 'pinch';
      ids: [number, number];
      startDist: number;
      startMid: Point;
      baseScale: number;
      baseTx: number;
      baseTy: number;
    };

type UsePhotoGestureOptions = {
  onSwipeMove?: (delta: Delta) => void;
  onSwipeEnd?: (delta: Delta) => void;
  onSwipeCancel?: () => void;
};

const IDLE_ZOOM: Zoom = { scale: 1, tx: 0, ty: 0, animating: false };

const SETTLED_ZOOM: Zoom = { scale: 1, tx: 0, ty: 0, animating: true };

const AXIS_LOCK_THRESHOLD = 10;

const MIN_SCALE = 1;

const MAX_SCALE = 4;

const SNAP_BACK_THRESHOLD = 1.02;

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const sameZoom = (a: Zoom, b: Zoom) =>
  a.scale === b.scale && a.tx === b.tx && a.ty === b.ty && a.animating === b.animating;

export const usePhotoGesture = ({
  onSwipeMove,
  onSwipeEnd,
  onSwipeCancel,
}: UsePhotoGestureOptions = {}) => {
  const [zoom, setZoomState] = useState<Zoom>(IDLE_ZOOM);

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const pointers = useRef(new Map<number, Point>());
  const mode = useRef<Mode>({ type: 'idle' });

  const setZoom = (next: Zoom) => {
    setZoomState((prev) => (sameZoom(prev, next) ? prev : next));
  };

  // Lock the swipe to the dominant axis once it crosses the threshold so the
  // gesture doesn't drift between horizontal nav and vertical close.
  const projectSwipe = (
    state: Extract<Mode, { type: 'swipe' }>,
    rawX: number,
    rawY: number,
  ): Delta => {
    if (
      state.axis === 'none' &&
      (Math.abs(rawX) >= AXIS_LOCK_THRESHOLD || Math.abs(rawY) >= AXIS_LOCK_THRESHOLD)
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

  // Anchor the focal point: the image-space point under the initial midpoint
  // stays under the current midpoint as scale changes. With V(P) = C + (P - C) * S + T
  // and C = viewport center (the active panel is centered there), solve for T.
  const computePinchTransform = (
    state: Extract<Mode, { type: 'pinch' }>,
    newDist: number,
    newMid: Point,
  ): Zoom => {
    const newScale = clamp((state.baseScale * newDist) / state.startDist, MIN_SCALE, MAX_SCALE);
    const ratio = newScale / state.baseScale;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    return {
      scale: newScale,
      tx: newMid.x - cx - (state.startMid.x - cx) * ratio + state.baseTx * ratio,
      ty: newMid.y - cy - (state.startMid.y - cy) * ratio + state.baseTy * ratio,
      animating: false,
    };
  };

  const settleAfterRelease = () => {
    if (zoomRef.current.scale <= SNAP_BACK_THRESHOLD) {
      setZoom(SETTLED_ZOOM);
    }
  };

  // When one finger of a pinch lifts, hand off to the other finger as a pan,
  // or end the gesture if it's gone too. Extra non-pinch pointers are ignored.
  const handoffPinch = (liftedId: number) => {
    if (mode.current.type !== 'pinch' || !mode.current.ids.includes(liftedId)) {
      return false;
    }

    const otherId = mode.current.ids[0] === liftedId ? mode.current.ids[1] : mode.current.ids[0];
    const otherPoint = pointers.current.get(otherId);

    if (otherPoint) {
      mode.current = {
        type: 'pan',
        pointerId: otherId,
        startX: otherPoint.x,
        startY: otherPoint.y,
        baseTx: zoomRef.current.tx,
        baseTy: zoomRef.current.ty,
      };
    } else {
      mode.current = { type: 'idle' };
      settleAfterRelease();
    }

    return true;
  };

  const reset = useCallback(() => {
    pointers.current.clear();
    mode.current = { type: 'idle' };
    setZoomState(IDLE_ZOOM);
  }, []);

  return {
    bind: {
      onPointerDown: (event: PointerEvent) => {
        if (event.pointerType !== 'touch') {
          return;
        }

        const id = event.pointerId;
        const point = { x: event.clientX, y: event.clientY };
        pointers.current.set(id, point);

        // Capture every touch pointer so move/up keeps firing even when a
        // finger drifts off the element (wide pinch).
        event.currentTarget.setPointerCapture(id);

        if (pointers.current.size === 1) {
          if (zoomRef.current.scale > 1) {
            mode.current = {
              type: 'pan',
              pointerId: id,
              startX: point.x,
              startY: point.y,
              baseTx: zoomRef.current.tx,
              baseTy: zoomRef.current.ty,
            };
          } else {
            mode.current = {
              type: 'swipe',
              pointerId: id,
              startX: point.x,
              startY: point.y,
              axis: 'none',
            };
          }

          return;
        }

        if (pointers.current.size === 2) {
          // Cancel any in-progress swipe before switching to pinch so the panel
          // snaps back instead of sliding under the fingers.
          if (mode.current.type === 'swipe') {
            onSwipeCancel?.();
          }

          const entries = [...pointers.current.entries()];
          const [id1, p1] = entries[0]!;
          const [id2, p2] = entries[1]!;

          mode.current = {
            type: 'pinch',
            ids: [id1, id2],
            startDist: Math.max(1, distance(p1, p2)),
            startMid: midpoint(p1, p2),
            baseScale: zoomRef.current.scale,
            baseTx: zoomRef.current.tx,
            baseTy: zoomRef.current.ty,
          };
        }
      },

      onPointerMove: (event: PointerEvent) => {
        const id = event.pointerId;

        if (!pointers.current.has(id)) {
          return;
        }

        const point = { x: event.clientX, y: event.clientY };
        pointers.current.set(id, point);

        if (mode.current.type === 'swipe' && mode.current.pointerId === id) {
          const delta = projectSwipe(
            mode.current,
            point.x - mode.current.startX,
            point.y - mode.current.startY,
          );
          onSwipeMove?.(delta);

          return;
        }

        if (mode.current.type === 'pan' && mode.current.pointerId === id) {
          setZoom({
            scale: zoomRef.current.scale,
            tx: mode.current.baseTx + (point.x - mode.current.startX),
            ty: mode.current.baseTy + (point.y - mode.current.startY),
            animating: false,
          });

          return;
        }

        if (mode.current.type === 'pinch') {
          const [id1, id2] = mode.current.ids;
          const p1 = pointers.current.get(id1);
          const p2 = pointers.current.get(id2);

          if (!p1 || !p2) {
            return;
          }

          setZoom(computePinchTransform(mode.current, distance(p1, p2), midpoint(p1, p2)));
        }
      },

      onPointerUp: (event: PointerEvent) => {
        const id = event.pointerId;
        const point = pointers.current.get(id);

        if (!point) {
          return;
        }

        pointers.current.delete(id);

        if (mode.current.type === 'swipe' && mode.current.pointerId === id) {
          const delta = projectSwipe(
            mode.current,
            point.x - mode.current.startX,
            point.y - mode.current.startY,
          );
          mode.current = { type: 'idle' };
          onSwipeEnd?.(delta);

          return;
        }

        if (mode.current.type === 'pan' && mode.current.pointerId === id) {
          mode.current = { type: 'idle' };
          settleAfterRelease();

          return;
        }

        handoffPinch(id);
      },

      onPointerCancel: (event: PointerEvent) => {
        const id = event.pointerId;
        pointers.current.delete(id);

        if (mode.current.type === 'swipe' && mode.current.pointerId === id) {
          mode.current = { type: 'idle' };
          onSwipeCancel?.();

          return;
        }

        if (mode.current.type === 'pan' && mode.current.pointerId === id) {
          mode.current = { type: 'idle' };
          settleAfterRelease();

          return;
        }

        handoffPinch(id);
      },
    },
    zoom,
    reset,
  };
};
