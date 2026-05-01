import type { ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '#/lib/utils.ts';

const eyebrowVariants = cva('font-sans font-medium uppercase', {
  variants: {
    tone: {
      gold: 'text-gold',
      'gold-deep': 'text-gold-deep',
      muted: 'text-ink-muted',
      paper: 'text-paper/60',
    },
    size: {
      sm: 'text-[10px] tracking-[0.4em]',
      md: 'text-[10px] tracking-[0.5em]',
      lg: 'text-[11px] tracking-[0.42em]',
    },
  },
  defaultVariants: { tone: 'gold', size: 'md' },
});

type EyebrowProps = ComponentPropsWithoutRef<'p'> & VariantProps<typeof eyebrowVariants>;

export const Eyebrow = ({ tone, size, className, ...props }: EyebrowProps) => (
  <p className={cn(eyebrowVariants({ tone, size }), className)} {...props} />
);
