import { Epilogue } from '@r2/ui/components/epilogue.tsx';
import { Monogram } from '@r2/ui/components/monogram.tsx';
import { PrivacyNote } from '@r2/ui/components/privacy-note.tsx';
import { Rule } from '@r2/ui/components/rule.tsx';
import { Section } from '@r2/ui/components/section.tsx';

export const LandingEpilogue = () => (
  <>
    <Section tone="ink" spacing="ample" className="text-center">
      <Epilogue.Root>
        <Monogram size="epilogue" tone="cream" className="mb-8">
          R2
        </Monogram>
        <Rule tone="paper" width="md" className="mx-auto bg-cream/40" />
        <Epilogue.Quote>
          « Et pour toujours, et pour toujours,
          <br />
          et pour toujours encore. »
        </Epilogue.Quote>
        <Rule tone="paper" width="md" className="mx-auto bg-cream/40" />
        <Epilogue.Signature>Romane &amp; Rémy Duprat-Gérard</Epilogue.Signature>
        <Epilogue.Date>IV MAI MMXXIV</Epilogue.Date>
      </Epilogue.Root>
    </Section>

    <Section tone="ink" spacing="compact" className="border-t border-cream/15 py-12">
      <PrivacyNote.Root>
        <PrivacyNote.Icon />
        <PrivacyNote.Text>
          Ces photos sont précieuses et privées. Nous vous remercions de respecter notre désir de
          garder ces souvenirs entre nous, et de ne pas les publier sur les réseaux sociaux sans
          notre accord.
        </PrivacyNote.Text>
      </PrivacyNote.Root>
    </Section>

    <footer className="relative z-3 border-t border-cream/10 bg-ink px-6 py-9 text-center">
      <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-cream/40">
        R2 · Galerie privée · 2026
      </p>
    </footer>
  </>
);
