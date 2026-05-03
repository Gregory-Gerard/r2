import { Eyebrow } from '@r2/ui/components/eyebrow.tsx';
import { Section } from '@r2/ui/components/section.tsx';
import { TableOfContents } from '@r2/ui/components/table-of-contents.tsx';

import { getChapterCount } from '../photos/photos-service.ts';

export const LandingToc = () => (
  <Section tone="paper" spacing="ample" id="sommaire">
    <TableOfContents.Root>
      <TableOfContents.Header>
        <Eyebrow size="md" className="mb-6">
          Sommaire
        </Eyebrow>
        <TableOfContents.Title>
          Six chapitres,
          <br />
          une seule journée
        </TableOfContents.Title>
      </TableOfContents.Header>

      <TableOfContents.List>
        <TableOfContents.Row href="#preparatifs">
          <TableOfContents.Number>I.</TableOfContents.Number>
          <TableOfContents.Chapter>Préparatifs</TableOfContents.Chapter>
          <TableOfContents.Time>11h00</TableOfContents.Time>
          <TableOfContents.Count>{getChapterCount('preparatifs')} photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#ceremonie-eglise">
          <TableOfContents.Number>II.</TableOfContents.Number>
          <TableOfContents.Chapter>Cérémonie</TableOfContents.Chapter>
          <TableOfContents.Time>14h30 — 15h30</TableOfContents.Time>
          <TableOfContents.Count>
            {getChapterCount('ceremonie-eglise')} photos
          </TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#seance-couple">
          <TableOfContents.Number>III.</TableOfContents.Number>
          <TableOfContents.Chapter>Séance Couple</TableOfContents.Chapter>
          <TableOfContents.Time>15h45</TableOfContents.Time>
          <TableOfContents.Count>{getChapterCount('seance-couple')} photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#cocktail">
          <TableOfContents.Number>IV.</TableOfContents.Number>
          <TableOfContents.Chapter>Cocktail</TableOfContents.Chapter>
          <TableOfContents.Time>17h00</TableOfContents.Time>
          <TableOfContents.Count>{getChapterCount('cocktail')} photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#soiree">
          <TableOfContents.Number>V.</TableOfContents.Number>
          <TableOfContents.Chapter>Soirée</TableOfContents.Chapter>
          <TableOfContents.Time>20h00</TableOfContents.Time>
          <TableOfContents.Count>{getChapterCount('soiree')} photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#dancefloor">
          <TableOfContents.Number>VI.</TableOfContents.Number>
          <TableOfContents.Chapter>Dancefloor</TableOfContents.Chapter>
          <TableOfContents.Time>23h00</TableOfContents.Time>
          <TableOfContents.Count>{getChapterCount('dancefloor')} photos</TableOfContents.Count>
        </TableOfContents.Row>
      </TableOfContents.List>
    </TableOfContents.Root>
  </Section>
);
