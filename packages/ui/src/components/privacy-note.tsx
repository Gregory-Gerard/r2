import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const PrivacyNoteRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'mx-auto flex max-w-letter flex-col items-center gap-3 text-center text-paper/55',
      className,
    )}
    {...props}
  />
);

const PrivacyNoteIcon = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    aria-hidden
    className={cn(
      'flex size-7 items-center justify-center rounded-full border border-cream/40 font-heading text-sm italic text-cream/70',
      className,
    )}
    {...props}
  >
    ·
  </span>
);

const PrivacyNoteText = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'max-w-[600px] font-heading text-[15px] italic leading-[1.6] text-paper/65',
      className,
    )}
    {...props}
  />
);

export const PrivacyNote = {
  Root: PrivacyNoteRoot,
  Icon: PrivacyNoteIcon,
  Text: PrivacyNoteText,
};
