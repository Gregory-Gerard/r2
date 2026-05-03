import { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from 'react';
import { preload } from 'react-dom';
import { Dialog as DialogPrimitive, VisuallyHidden } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';

import { blurhashToDataUrl } from '#/lib/blurhash.ts';
import { cn } from '#/lib/utils.ts';
import { useSwipe } from '#/lib/use-swipe.ts';
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
  const swipe = useSwipe({
    onSwipeLeft: () => onNav({ delta: 1 }),
    onSwipeRight: () => onNav({ delta: -1 }),
    onSwipeDown: onClose,
  });

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
          className="fixed inset-0 z-50 flex touch-none items-center justify-center outline-none duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
          onOpenAutoFocus={(event) => event.preventDefault()}
          {...swipe}
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

const LightboxBody = ({ state, onClose, onNav }: LightboxBodyProps) => {
  const { photos, index, meta } = state;
  const photo = photos[index];
  const total = photos.length;
  const next = photos[(index + 1) % total];
  const prev = photos[(index - 1 + total) % total];

  useEffect(() => {
    if (next) {
      preload(next.src, { as: 'image', imageSrcSet: next.srcSet.webp, imageSizes: '95vw' });
    }

    if (prev) {
      preload(prev.src, { as: 'image', imageSrcSet: prev.srcSet.webp, imageSizes: '95vw' });
    }
  }, [next, prev]);

  if (!photo) {
    return null;
  }

  return (
    <>
      <div aria-hidden className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

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

      <LightboxImage
        key={photo.id}
        photo={photo}
        alt={`${meta.chapterLabel} — photo ${index + 1}`}
      />

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
