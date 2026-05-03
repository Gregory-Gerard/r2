import { Facts } from '@r2/ui/components/facts.tsx';
import { Section } from '@r2/ui/components/section.tsx';

import { useDaysSince } from './use-days-since.ts';

const FRENCH = new Intl.NumberFormat('fr-FR');
const WEDDING_DATE = new Date('2024-05-04T14:30:00');

export const LandingFacts = () => {
  const days = useDaysSince(WEDDING_DATE);
  const years = (days / 365.25).toFixed(1);

  return (
    <Section tone="paper-deep" spacing="compact">
      <Facts.Root>
        <Facts.Cell>
          <Facts.Label>La date</Facts.Label>
          <Facts.Value>4 mai 2024</Facts.Value>
          <Facts.Sub>SAMEDI · 14H30</Facts.Sub>
        </Facts.Cell>
        <Facts.Cell>
          <Facts.Label>Le lieu</Facts.Label>
          <Facts.Value>Cathédrale &amp; Château</Facts.Value>
          <Facts.Sub>SAINT-ANTONIN · RIVENEUVE DU BOSC</Facts.Sub>
        </Facts.Cell>
        <Facts.Cell>
          <Facts.Label>Depuis ce jour</Facts.Label>
          <Facts.Value>{FRENCH.format(days)} jours</Facts.Value>
          <Facts.Sub>SOIT {years} ANNÉES D&apos;AMOUR</Facts.Sub>
        </Facts.Cell>
      </Facts.Root>
    </Section>
  );
};
