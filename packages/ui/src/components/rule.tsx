import type { ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '#/lib/utils.ts';

const ruleVariants = cva('h-px shrink-0', {
  variants: {
    tone: {
      gold: 'bg-gold/50',
      paper: 'bg-paper/40',
      ink: 'bg-ink/30',
    },
    width: {
      xs: 'w-7',
      sm: 'w-10',
      md: 'w-15',
      lg: 'w-24',
      full: 'w-full',
    },
  },
  defaultVariants: { tone: 'gold', width: 'md' },
});

type RuleProps = ComponentPropsWithoutRef<'div'> & VariantProps<typeof ruleVariants>;

export const Rule = ({ tone, width, className, ...props }: RuleProps) => (
  <div role="separator" className={cn(ruleVariants({ tone, width }), className)} {...props} />
);
