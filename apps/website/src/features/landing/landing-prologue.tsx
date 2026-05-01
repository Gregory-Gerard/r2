import { Eyebrow } from '@r2/ui/components/eyebrow.tsx';
import { Letter } from '@r2/ui/components/letter.tsx';
import { Ornament } from '@r2/ui/components/ornament.tsx';
import { Section } from '@r2/ui/components/section.tsx';

export const LandingPrologue = () => (
  <Section tone="paper" spacing="regular">
    <Letter.Root>
      <Eyebrow size="md">Prologue</Eyebrow>
      <Letter.Title>
        Un mot avant <em>de tourner</em> la page
      </Letter.Title>
      <Letter.Body>
        <p>Chère famille, chers amis,</p>
        <p>
          Il y a un peu plus de deux ans, vous étiez auprès de nous pour vivre notre merveilleux
          mariage. Nous sommes encore remplis de gratitude pour votre amour, vos rires, vos larmes
          et toute la chaleur de cette journée.
        </p>
        <p>
          Voici, enfin réunies, les images de ce jour si spécial — classées en sept chapitres, dans
          l&apos;ordre où elles ont été vécues. Prenez le temps de les feuilleter ; chaque photo est
          un souvenir que nous partageons avec vous.
        </p>
        <p>
          <em>Merci d&apos;avoir contribué à rendre ce jour inoubliable.</em>
        </p>
      </Letter.Body>
      <Letter.Signature>Romane &amp; Rémy</Letter.Signature>
      <Ornament.Root className="mt-7">
        <Ornament.Rule />
        <Ornament.Mark>R2</Ornament.Mark>
        <Ornament.Rule />
      </Ornament.Root>
    </Letter.Root>
  </Section>
);
