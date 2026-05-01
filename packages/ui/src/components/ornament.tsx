import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const OrnamentRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn('mx-auto flex items-center justify-center gap-5 text-gold', className)}
    {...props}
  />
);

const OrnamentRule = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span aria-hidden className={cn('h-px w-15 bg-gold/50', className)} {...props} />
);

const OrnamentMark = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span className={cn('font-heading text-lg italic font-medium text-gold', className)} {...props} />
);

export const Ornament = {
  Root: OrnamentRoot,
  Rule: OrnamentRule,
  Mark: OrnamentMark,
};
