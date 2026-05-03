import { useMemo, useState, type ComponentPropsWithoutRef } from 'react';
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

type AlbumPhoto = AlbumImage & { source: MosaicPhoto };

type MosaicProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  photos: readonly MosaicPhoto[];
  alt: (photo: MosaicPhoto, index: number) => string;
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

export const Mosaic = ({ photos, alt, className, ...props }: MosaicProps) => {
  const albumPhotos = useMemo<AlbumPhoto[]>(
    () =>
      photos.map((photo, index) => ({
        key: photo.id,
        src: photo.src,
        width: photo.width,
        height: photo.height,
        alt: alt(photo, index),
        source: photo,
      })),
    [photos, alt],
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
};

const renderImage: RenderImage<AlbumPhoto> = (imgProps, { photo, width }) => (
  <MosaicTile photo={photo} renderedWidth={width} alt={imgProps.alt} />
);

type MosaicTileProps = {
  photo: AlbumPhoto;
  renderedWidth: number;
  alt: string | undefined;
};

const MosaicTile = ({ photo, renderedWidth, alt }: MosaicTileProps) => {
  const { source } = photo;
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const [loaded, setLoaded] = useState(false);
  const blurDataUrl = useMemo(
    () => (near ? blurhashToDataUrl(source.blurhash) : null),
    [near, source.blurhash],
  );

  const sizes = `${Math.round(renderedWidth)}px`;

  return (
    <div
      ref={ref}
      className={cn(
        'group relative block w-full overflow-hidden bg-paper-shade',
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
    </div>
  );
};
