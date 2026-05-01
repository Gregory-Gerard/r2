import { LandingEpilogue } from './landing-epilogue.tsx';
import { LandingFacts } from './landing-facts.tsx';
import { LandingHero } from './landing-hero.tsx';
import { LandingPrologue } from './landing-prologue.tsx';
import { LandingToc } from './landing-toc.tsx';

export const LandingPage = () => (
  <>
    <LandingHero />
    <LandingPrologue />
    <LandingFacts />
    <LandingToc />
    <LandingEpilogue />
  </>
);
