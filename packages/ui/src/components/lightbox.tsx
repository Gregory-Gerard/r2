import {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type TransitionEvent,
} from 'react';
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';

import { blurhashToDataUrl } from '#/lib/blurhash.ts';
import { cn } from '#/lib/utils.ts';
import { useDrag } from '#/lib/use-drag.ts';
import { Rule } from '#/components/rule.tsx';
import type { MosaicPhoto } from '#/components/mosaic.tsx';

export type LightboxState = {
  photos: readonly MosaicPhoto[];
  index: number;
  meta: { chapterNum: string; chapterLabel: string };
};

type LightboxProps = {
  state: LightboxState | null;
  onClose: () => void;
  onNav: (input: { delta: -1 | 1 }) => void;
};

export const Lightbox = ({ state, onClose, onNav }: LightboxProps) => {
  const open = state !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        onNav({ delta: -1 });
      } else if (event.key === 'ArrowRight') {
        onNav({ delta: 1 });
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [open, onNav]);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-night/95 duration-200 supports-backdrop-filter:backdrop-blur-md data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex touch-pinch-zoom items-center justify-center overflow-hidden outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>
              {state ? `${state.meta.chapterLabel} — photo ${state.index + 1}` : 'Galerie'}
            </DialogPrimitive.Title>
          </VisuallyHidden.Root>

          {state ? <LightboxBody state={state} onClose={onClose} onNav={onNav} /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

type LightboxBodyProps = {
  state: LightboxState;
  onClose: () => void;
  onNav: (input: { delta: -1 | 1 }) => void;
};

type Pending = 'next' | 'prev' | 'close' | null;

const LightboxBody = ({ state, onClose, onNav }: LightboxBodyProps) => {
  const { photos, index, meta } = state;
  const photo = photos[index];
  const total = photos.length;
  const next = photos[(index + 1) % total];
  const prev = photos[(index - 1 + total) % total];

  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [animating, setAnimating] = useState(false);
  const [pending, setPending] = useState<Pending>(null);

  const dragBind = useDrag({
    onMove: (delta) => {
      if (animating) {
        return;
      }

      setDrag(delta);
    },
    onEnd: ({ x, y }) => {
      if (animating) {
        return;
      }

      const xThreshold = window.innerWidth * 0.2;
      const yThreshold = window.innerHeight * 0.18;
      const horizontal = Math.abs(x) > Math.abs(y);

      if (horizontal && Math.abs(x) > xThreshold) {
        setAnimating(true);
        setPending(x < 0 ? 'next' : 'prev');
        setDrag({ x: Math.sign(x) * window.innerWidth, y: 0 });

        return;
      }

      if (!horizontal && y > yThreshold) {
        setAnimating(true);
        setPending('close');
        setDrag({ x: 0, y: window.innerHeight });

        return;
      }

      if (drag.x !== 0 || drag.y !== 0) {
        setAnimating(true);
        setDrag({ x: 0, y: 0 });
      }
    },
    onCancel: () => {
      if (animating) {
        return;
      }

      if (drag.x !== 0 || drag.y !== 0) {
        setAnimating(true);
        setDrag({ x: 0, y: 0 });
      }
    },
  });

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform') {
      return;
    }

    if (pending === 'next') {
      onNav({ delta: 1 });
    } else if (pending === 'prev') {
      onNav({ delta: -1 });
    } else if (pending === 'close') {
      onClose();
    }

    setAnimating(false);
    setPending(null);
    setDrag({ x: 0, y: 0 });
  };

  if (!photo) {
    return null;
  }

  const fade =
    pending === 'close' ? 0 : Math.max(0.5, 1 - Math.max(0, drag.y) / window.innerHeight);

  return (
    <>
      <LightboxButton variant="close" onClick={onClose} aria-label="Fermer">
        <XIcon className="h-6 w-6" />
      </LightboxButton>

      <LightboxButton
        variant="prev"
        onClick={() => onNav({ delta: -1 })}
        aria-label="Photo précédente"
      >
        <ChevronLeftIcon className="h-8 w-8" />
      </LightboxButton>

      <LightboxButton
        variant="next"
        onClick={() => onNav({ delta: 1 })}
        aria-label="Photo suivante"
      >
        <ChevronRightIcon className="h-8 w-8" />
      </LightboxButton>

      <div
        {...dragBind}
        onTransitionEnd={handleTransitionEnd}
        className="absolute top-0 left-0 flex h-full"
        style={{
          width: '300vw',
          transform: `translate3d(calc(-100vw + ${drag.x}px), ${drag.y}px, 0)`,
          opacity: fade,
          transition: animating
            ? 'transform 240ms cubic-bezier(0.2, 0, 0, 1), opacity 240ms cubic-bezier(0.2, 0, 0, 1)'
            : 'none',
          willChange: 'transform',
        }}
      >
        <LightboxPanel
          key={prev.id}
          photo={prev}
          alt={`${meta.chapterLabel} — photo ${((index - 1 + total) % total) + 1}`}
        />
        <LightboxPanel
          key={photo.id}
          photo={photo}
          alt={`${meta.chapterLabel} — photo ${index + 1}`}
        />
        <LightboxPanel
          key={next.id}
          photo={next}
          alt={`${meta.chapterLabel} — photo ${((index + 1) % total) + 1}`}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-4 px-6 font-sans text-[10px] tracking-[0.32em] text-cream/70 uppercase">
        <span>CH. {meta.chapterNum}</span>
        <Rule tone="gold" width="sm" className="bg-gold/60" />
        <span>
          {meta.chapterLabel} — {index + 1} / {total}
        </span>
      </div>
    </>
  );
};

type LightboxPanelProps = {
  photo: MosaicPhoto;
  alt: string;
};

const LightboxPanel = ({ photo, alt }: LightboxPanelProps) => (
  <div className="flex h-full w-screen shrink-0 items-center justify-center">
    <LightboxImage photo={photo} alt={alt} />
  </div>
);

const lightboxButtonVariants = cva(
  'absolute z-10 grid place-items-center transition-colors hover:text-cream',
  {
    variants: {
      variant: {
        close: 'top-5 right-5 h-11 w-11 text-cream/80',
        prev: 'top-1/2 left-3 h-12 w-12 -translate-y-1/2 text-cream/70 md:left-6',
        next: 'top-1/2 right-3 h-12 w-12 -translate-y-1/2 text-cream/70 md:right-6',
      },
    },
  },
);

type LightboxButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof lightboxButtonVariants>;

const LightboxButton = ({ variant, className, ...props }: LightboxButtonProps) => (
  <button type="button" {...props} className={cn(lightboxButtonVariants({ variant }), className)} />
);

type LightboxImageProps = {
  photo: MosaicPhoto;
  alt: string;
};

const LightboxImage = ({ photo, alt }: LightboxImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const blurDataUrl = useMemo(() => blurhashToDataUrl(photo.blurhash), [photo.blurhash]);

  return (
    <div
      className="relative z-10 max-h-[88vh] max-w-[95vw]"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      onClick={(event) => event.stopPropagation()}
    >
      {blurDataUrl ? (
        <div
          aria-hidden
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            loaded ? 'opacity-0' : 'opacity-100',
          )}
          style={{
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}

      <picture>
        <source type="image/avif" srcSet={photo.srcSet.avif} sizes="95vw" />
        <source type="image/webp" srcSet={photo.srcSet.webp} sizes="95vw" />
        <img
          src={photo.src}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            'block max-h-[88vh] max-w-[95vw] object-contain transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      </picture>
    </div>
  );
};
