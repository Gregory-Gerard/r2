import { memo, useCallback, useMemo, useState, type ComponentPropsWithoutRef } from 'react';
import { RowsPhotoAlbum, type Photo as AlbumImage, type RenderImage } from 'react-photo-album';

import { blurhashToDataUrl } from '#/lib/blurhash.ts';
import { useNearViewport } from '#/lib/use-near-viewport.ts';
import { cn } from '#/lib/utils.ts';

export type MosaicPhoto = {
  id: string;
  width: number;
  height: number;
  blurhash: string;
  src: string;
  srcSet: { avif: string; webp: string };
};

export type MosaicPhotoAt = { photo: MosaicPhoto; index: number };

type AlbumPhoto = AlbumImage & { source: MosaicPhoto };

type MosaicProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  photos: readonly MosaicPhoto[];
  alt: (at: MosaicPhotoAt) => string;
  onPhotoClick: (at: MosaicPhotoAt) => void;
};

const targetRowHeight = (containerWidth: number) => {
  if (containerWidth < 640) {
    return 180;
  }

  if (containerWidth < 1024) {
    return 280;
  }

  return 360;
};

export const Mosaic = memo(({ photos, alt, onPhotoClick, className, ...props }: MosaicProps) => {
  const albumPhotos = useMemo<AlbumPhoto[]>(
    () =>
      photos.map((photo, index) => ({
        key: photo.id,
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: alt({ photo, index }),
        source: photo,
      })),
    [photos, alt],
  );

  const renderImage = useCallback<RenderImage<AlbumPhoto>>(
    (imgProps, { photo, width, index }) => (
      <MosaicTile
        photo={photo}
        width={width}
        alt={imgProps.alt}
        onClick={() => onPhotoClick({ photo: photo.source, index })}
      />
    ),
    [onPhotoClick],
  );

  return (
    <div className={cn('mx-auto w-full max-w-editorial', className)} {...props}>
      <RowsPhotoAlbum
        photos={albumPhotos}
        spacing={14}
        targetRowHeight={targetRowHeight}
        render={{ image: renderImage }}
      />
    </div>
  );
});
Mosaic.displayName = 'Mosaic';

type MosaicTileProps = {
  photo: AlbumPhoto;
  width: number;
  alt: string | undefined;
  onClick: () => void;
};

const MosaicTile = ({ photo, width, alt, onClick }: MosaicTileProps) => {
  const { source } = photo;
  const [ref, near] = useNearViewport<HTMLButtonElement>();
  const [loaded, setLoaded] = useState(false);
  const blurDataUrl = useMemo(
    () => (near ? blurhashToDataUrl(source.blurhash) : null),
    [near, source.blurhash],
  );

  const sizes = `${Math.round(width)}px`;

  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      aria-label={alt ?? 'Ouvrir la photo'}
      className={cn(
        'group relative block w-full cursor-zoom-in overflow-hidden bg-paper-shade p-0 text-left',
        'transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] will-change-transform',
        'hover:-translate-y-0.75 hover:shadow-[0_24px_50px_rgb(42_26_16/0.22)]',
        'after:pointer-events-none after:absolute after:inset-0 after:border after:border-ink/5',
      )}
      style={{
        aspectRatio: `${source.width} / ${source.height}`,
        backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {near ? (
        <picture>
          <source type="image/avif" srcSet={source.srcSet.avif} sizes={sizes} />
          <source type="image/webp" srcSet={source.srcSet.webp} sizes={sizes} />
          <img
            src={source.src}
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
          />
        </picture>
      ) : null}
    </button>
  );
};
