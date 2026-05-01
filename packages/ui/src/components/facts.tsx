import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const FactsRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'mx-auto grid max-w-editorial grid-cols-3 max-md:grid-cols-1 max-md:gap-6',
      className,
    )}
    {...props}
  />
);

const FactsCell = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'relative px-6 py-4 text-center',
      'not-first:before:absolute not-first:before:inset-y-[20%] not-first:before:left-0 not-first:before:w-px not-first:before:bg-gold/30',
      'max-md:before:hidden max-md:not-first:border-t max-md:not-first:border-gold/20 max-md:not-first:pt-6',
      className,
    )}
    {...props}
  />
);

const FactsLabel = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-gold-deep',
      className,
    )}
    {...props}
  />
);

const FactsValue = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'font-heading text-[clamp(22px,2.6vw,32px)] italic font-normal leading-tight text-ink',
      className,
    )}
    {...props}
  />
);

const FactsSub = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn('mt-1.5 font-heading text-sm tracking-[0.08em] text-ink-muted', className)}
    {...props}
  />
);

export const Facts = {
  Root: FactsRoot,
  Cell: FactsCell,
  Label: FactsLabel,
  Value: FactsValue,
  Sub: FactsSub,
};
