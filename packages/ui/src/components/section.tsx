import type { ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '#/lib/utils.ts';

const sectionVariants = cva('relative z-3 scroll-mt-10 px-6', {
  variants: {
    tone: {
      paper: 'bg-paper text-ink',
      'paper-deep': 'bg-paper-deep text-ink border-y border-gold/20',
      ink: 'bg-ink text-paper',
      night: 'bg-night text-paper',
    },
    spacing: {
      none: 'py-0',
      compact: 'py-15',
      regular: 'py-30',
      ample: 'py-35',
    },
  },
  defaultVariants: { tone: 'paper', spacing: 'regular' },
});

type SectionProps = ComponentPropsWithoutRef<'section'> & VariantProps<typeof sectionVariants>;

export const Section = ({ tone, spacing, className, ...props }: SectionProps) => (
  <section className={cn(sectionVariants({ tone, spacing }), className)} {...props} />
);
