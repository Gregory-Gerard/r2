import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const LetterRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('mx-auto max-w-letter text-center', className)} {...props} />
);

const LetterTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
  <h2
    className={cn(
      'mt-8 mb-10 font-heading text-[clamp(40px,5vw,64px)] italic font-normal leading-[1.1] tracking-[-0.01em] text-ink [&_em]:not-italic [&_em]:text-terracotta',
      className,
    )}
    {...props}
  />
);

const LetterBody = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'space-y-4 font-heading text-[19px] leading-[1.8] text-ink-soft [&_em]:italic [&_em]:text-terracotta',
      className,
    )}
    {...props}
  />
);

const LetterSignature = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p className={cn('mt-14 font-heading text-[28px] italic text-ink', className)} {...props} />
);

export const Letter = {
  Root: LetterRoot,
  Title: LetterTitle,
  Body: LetterBody,
  Signature: LetterSignature,
};
