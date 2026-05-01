import { Eyebrow } from '@r2/ui/components/eyebrow.tsx';
import { Section } from '@r2/ui/components/section.tsx';
import { TableOfContents } from '@r2/ui/components/table-of-contents.tsx';

export const LandingToc = () => (
  <Section tone="paper" spacing="ample" id="sommaire">
    <TableOfContents.Root>
      <TableOfContents.Header>
        <Eyebrow size="md" className="mb-6">
          Sommaire
        </Eyebrow>
        <TableOfContents.Title>
          Sept chapitres,
          <br />
          une seule journée
        </TableOfContents.Title>
      </TableOfContents.Header>

      <TableOfContents.List>
        <TableOfContents.Row href="#preparatifs">
          <TableOfContents.Number>I.</TableOfContents.Number>
          <TableOfContents.Chapter>Préparatifs</TableOfContents.Chapter>
          <TableOfContents.Time>11h00</TableOfContents.Time>
          <TableOfContents.Count>64 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#eglise">
          <TableOfContents.Number>II.</TableOfContents.Number>
          <TableOfContents.Chapter>Église</TableOfContents.Chapter>
          <TableOfContents.Time>14h30</TableOfContents.Time>
          <TableOfContents.Count>92 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#ceremonie">
          <TableOfContents.Number>III.</TableOfContents.Number>
          <TableOfContents.Chapter>Cérémonie</TableOfContents.Chapter>
          <TableOfContents.Time>14h30 — 15h30</TableOfContents.Time>
          <TableOfContents.Count>58 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#seance-couple">
          <TableOfContents.Number>IV.</TableOfContents.Number>
          <TableOfContents.Chapter>Séance Couple</TableOfContents.Chapter>
          <TableOfContents.Time>15h45</TableOfContents.Time>
          <TableOfContents.Count>41 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#cocktail">
          <TableOfContents.Number>V.</TableOfContents.Number>
          <TableOfContents.Chapter>Cocktail</TableOfContents.Chapter>
          <TableOfContents.Time>17h00</TableOfContents.Time>
          <TableOfContents.Count>73 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#soiree">
          <TableOfContents.Number>VI.</TableOfContents.Number>
          <TableOfContents.Chapter>Soirée</TableOfContents.Chapter>
          <TableOfContents.Time>20h00</TableOfContents.Time>
          <TableOfContents.Count>86 photos</TableOfContents.Count>
        </TableOfContents.Row>

        <TableOfContents.Row href="#dancefloor">
          <TableOfContents.Number>VII.</TableOfContents.Number>
          <TableOfContents.Chapter>Dancefloor</TableOfContents.Chapter>
          <TableOfContents.Time>23h00</TableOfContents.Time>
          <TableOfContents.Count>110 photos</TableOfContents.Count>
        </TableOfContents.Row>
      </TableOfContents.List>
    </TableOfContents.Root>
  </Section>
);
