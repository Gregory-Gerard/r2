import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const EpilogueRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('mx-auto max-w-letter text-center', className)} {...props} />
);

const EpilogueQuote = ({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
  <blockquote
    className={cn('my-9 font-heading text-[22px] italic leading-[1.6] text-paper/85', className)}
    {...props}
  />
);

const EpilogueSignature = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p className={cn('mt-6 font-heading text-2xl italic text-cream', className)} {...props} />
);

const EpilogueDate = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn('mt-5 font-sans text-[10px] uppercase tracking-[0.5em] text-cream/50', className)}
    {...props}
  />
);

export const Epilogue = {
  Root: EpilogueRoot,
  Quote: EpilogueQuote,
  Signature: EpilogueSignature,
  Date: EpilogueDate,
};
