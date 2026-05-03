import { useCallback, useMemo, useState } from 'react';

import { Chapter } from '@r2/ui/components/chapter.tsx';
import { Lightbox, type LightboxState } from '@r2/ui/components/lightbox.tsx';
import { Mosaic, type MosaicPhoto, type MosaicPhotoAt } from '@r2/ui/components/mosaic.tsx';
import { Rule } from '@r2/ui/components/rule.tsx';
import { type SectionTone } from '@r2/ui/components/section.tsx';

import { buildSrcSet, getPhotosByChapter, photoUrl } from '../photos/photos-service.ts';

const PREVIEW_COUNT = 18;

type ChapterPhotosProps = {
  slug: string;
  label: string;
  num: string;
  tone: SectionTone;
  onOpen: (state: LightboxState) => void;
};

const ChapterPhotos = ({ slug, label, num, tone, onOpen }: ChapterPhotosProps) => {
  const photos = getPhotosByChapter(slug);
  const [expanded, setExpanded] = useState(false);

  const all = useMemo<MosaicPhoto[]>(
    () =>
      photos.map((p) => ({
        ...p,
        src: photoUrl(p.id, 'webp', 1600),
        srcSet: { avif: buildSrcSet(p.id, 'avif'), webp: buildSrcSet(p.id, 'webp') },
      })),
    [photos],
  );
  const visible = useMemo(() => (expanded ? all : all.slice(0, PREVIEW_COUNT)), [all, expanded]);

  const alt = useCallback(({ index }: MosaicPhotoAt) => `${label} — photo ${index + 1}`, [label]);

  const remaining = photos.length - PREVIEW_COUNT;
  const collapsed = !expanded && remaining > 0;

  const handlePhotoClick = useCallback(
    ({ index }: MosaicPhotoAt) =>
      onOpen({ photos: all, index, meta: { chapterNum: num, chapterLabel: label } }),
    [all, num, label, onOpen],
  );

  return (
    <div className="relative -mx-6 -mt-8 overflow-hidden px-6 pt-8 md:-mx-14 md:px-14">
      <Mosaic photos={visible} alt={alt} onPhotoClick={handlePhotoClick} />

      {collapsed ? (
        <Chapter.Reveal tone={tone} remaining={remaining} onClick={() => setExpanded(true)} />
      ) : null}
    </div>
  );
};

export const LandingChapters = () => {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const handleClose = useCallback(() => setLightbox(null), []);

  const handleNav = useCallback(({ delta }: { delta: -1 | 1 }) => {
    setLightbox((cur) => {
      if (!cur) {
        return cur;
      }

      const len = cur.photos.length;

      return { ...cur, index: (cur.index + delta + len) % len };
    });
  }, []);

  return (
    <>
      <Chapter.Root tone="paper" id="preparatifs">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · I</Chapter.Number>
          <Chapter.Title>Préparatifs</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>Au matin du quatre mai · 11h00</Chapter.Subtitle>
          <Chapter.Caption>
            Les derniers gestes, les regards complices, le silence avant les promesses.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos
          slug="preparatifs"
          label="Préparatifs"
          num="I"
          tone="paper"
          onOpen={setLightbox}
        />
      </Chapter.Root>

      <Chapter.Root tone="ink" id="ceremonie-eglise">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · II</Chapter.Number>
          <Chapter.Title>Cérémonie</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>En la cathédrale · 14h30 — 15h30</Chapter.Subtitle>
          <Chapter.Caption>
            Sous les voûtes, les vœux échangés et l&apos;écho des cloches.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos
          slug="ceremonie-eglise"
          label="Cérémonie"
          num="II"
          tone="ink"
          onOpen={setLightbox}
        />
      </Chapter.Root>

      <Chapter.Root tone="paper-deep" id="seance-couple">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · III</Chapter.Number>
          <Chapter.Title>Séance Couple</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>Entre eux deux · 15h45</Chapter.Subtitle>
          <Chapter.Caption>
            Le temps suspendu, juste pour eux, dans la lumière de fin d&apos;après-midi.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos
          slug="seance-couple"
          label="Séance Couple"
          num="III"
          tone="paper-deep"
          onOpen={setLightbox}
        />
      </Chapter.Root>

      <Chapter.Root tone="paper" id="cocktail">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · IV</Chapter.Number>
          <Chapter.Title>Cocktail</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>Au château, vin d&apos;honneur · 17h00</Chapter.Subtitle>
          <Chapter.Caption>
            Les discours, les toasts, les bulles et les retrouvailles dans les jardins.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos
          slug="cocktail"
          label="Cocktail"
          num="IV"
          tone="paper"
          onOpen={setLightbox}
        />
      </Chapter.Root>

      <Chapter.Root tone="ink" id="soiree">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · V</Chapter.Number>
          <Chapter.Title>Soirée</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>Le dîner aux chandelles · 20h00</Chapter.Subtitle>
          <Chapter.Caption>
            Le dîner aux chandelles, les regards émus — et le gâteau coupé à deux mains.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos slug="soiree" label="Soirée" num="V" tone="ink" onOpen={setLightbox} />
      </Chapter.Root>

      <Chapter.Root tone="night" id="dancefloor">
        <Chapter.Header>
          <Chapter.Number>CHAPITRE · VI</Chapter.Number>
          <Chapter.Title>Dancefloor</Chapter.Title>
          <Rule tone="gold" width="md" className="my-5" />
          <Chapter.Subtitle>Jusqu&apos;au petit matin · 23h00</Chapter.Subtitle>
          <Chapter.Caption>
            La piste s&apos;enflamme — et l&apos;on danse comme si la nuit ne devait jamais finir.
          </Chapter.Caption>
        </Chapter.Header>

        <ChapterPhotos
          slug="dancefloor"
          label="Dancefloor"
          num="VI"
          tone="night"
          onOpen={setLightbox}
        />
      </Chapter.Root>

      <Lightbox state={lightbox} onClose={handleClose} onNav={handleNav} />
    </>
  );
};
