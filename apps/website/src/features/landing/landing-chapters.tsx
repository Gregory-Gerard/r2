import { useCallback, useMemo, useState } from 'react';

import { Chapter } from '@r2/ui/components/chapter.tsx';
import { Mosaic } from '@r2/ui/components/mosaic.tsx';
import { Rule } from '@r2/ui/components/rule.tsx';
import { type SectionTone } from '@r2/ui/components/section.tsx';

import { buildSrcSet, getPhotosByChapter, photoUrl } from '../photos/photos-service.ts';

const PREVIEW_COUNT = 18;

type ChapterPhotosProps = {
  slug: string;
  label: string;
  tone: SectionTone;
};

const ChapterPhotos = ({ slug, label, tone }: ChapterPhotosProps) => {
  const photos = getPhotosByChapter(slug);
  const [expanded, setExpanded] = useState(false);
  const visible = useMemo(
    () =>
      (expanded ? photos : photos.slice(0, PREVIEW_COUNT)).map((p) => ({
        ...p,
        src: photoUrl(p.id, 'webp', 800),
        srcSet: { avif: buildSrcSet(p.id, 'avif'), webp: buildSrcSet(p.id, 'webp') },
      })),
    [photos, expanded],
  );
  const alt = useCallback((_: unknown, index: number) => `${label} — photo ${index + 1}`, [label]);
  const remaining = photos.length - PREVIEW_COUNT;
  const collapsed = !expanded && remaining > 0;

  return (
    <div className="relative -mx-6 -mt-8 overflow-hidden px-6 pt-8 md:-mx-14 md:px-14">
      <Mosaic photos={visible} alt={alt} />
      {collapsed ? (
        <Chapter.Reveal tone={tone} remaining={remaining} onClick={() => setExpanded(true)} />
      ) : null}
    </div>
  );
};

export const LandingChapters = () => (
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
      <ChapterPhotos slug="preparatifs" label="Préparatifs" tone="paper" />
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
      <ChapterPhotos slug="ceremonie-eglise" label="Cérémonie" tone="ink" />
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
      <ChapterPhotos slug="seance-couple" label="Séance Couple" tone="paper-deep" />
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
      <ChapterPhotos slug="cocktail" label="Cocktail" tone="paper" />
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
      <ChapterPhotos slug="soiree" label="Soirée" tone="ink" />
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
      <ChapterPhotos slug="dancefloor" label="Dancefloor" tone="night" />
    </Chapter.Root>
  </>
);
