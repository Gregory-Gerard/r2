import type { ComponentPropsWithoutRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '#/lib/utils.ts';

const monogramVariants = cva(
  'font-heading italic font-light leading-[0.85] tracking-[-0.02em] block text-center [text-box:trim-both_cap_alphabetic]',
  {
    variants: {
      tone: {
        light:
          'text-[#f7e7c2] [text-shadow:0_2px_40px_rgb(0_0_0/0.5),0_0_80px_rgb(168_122_61/0.3)]',
        cream: 'text-cream',
        ink: 'text-ink',
      },
      size: {
        hero: 'text-[clamp(120px,min(28vw,40vh),380px)]',
        epilogue: 'text-[clamp(80px,12vw,160px)]',
      },
    },
    defaultVariants: { tone: 'light', size: 'hero' },
  },
);

type MonogramProps = ComponentPropsWithoutRef<'h1'> & VariantProps<typeof monogramVariants>;

export const Monogram = ({ tone, size, className, ...props }: MonogramProps) => (
  <h1 className={cn(monogramVariants({ tone, size }), className)} {...props} />
);
