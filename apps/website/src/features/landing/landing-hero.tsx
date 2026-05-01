import { Hero } from '@r2/ui/components/hero.tsx';
import { Monogram } from '@r2/ui/components/monogram.tsx';
import { Rule } from '@r2/ui/components/rule.tsx';

export const LandingHero = () => (
  <Hero.Root id="top">
    <Hero.Image src="/hero-couple.jpg" alt="Romane et Rémy" />
    <Hero.Vignette />

    <Hero.Nav>
      <Hero.NavItem>R · 2 · R</Hero.NavItem>
      <Hero.NavMeta>le quatre mai deux mille vingt-quatre</Hero.NavMeta>
      <Hero.NavItem className="text-right">Galerie privée</Hero.NavItem>
    </Hero.Nav>

    <Hero.Content>
      <Hero.Overline>Romane &amp; Rémy</Hero.Overline>
      <Monogram size="hero" tone="light">
        R2
      </Monogram>
      <Hero.Title>se sont dit oui</Hero.Title>
      <Rule tone="paper" width="md" className="my-[clamp(24px,4.5vh,52px)] bg-cream/50" />
      <Hero.Date>IV · MAI · MMXXIV</Hero.Date>
    </Hero.Content>

    <Hero.Scroll label="Tournez la page" />
  </Hero.Root>
);
