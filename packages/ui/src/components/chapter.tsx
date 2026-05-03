import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { Section, type SectionTone } from '#/components/section.tsx';
import { cn } from '#/lib/utils.ts';

type ChapterRootProps = Omit<ComponentPropsWithoutRef<'section'>, 'children'> & {
  tone?: SectionTone;
  children?: ReactNode;
};

const ChapterRoot = ({ tone = 'paper', className, children, ...props }: ChapterRootProps) => (
  <Section tone={tone} spacing="regular" className={className} {...props}>
    <div className="mx-auto w-full max-w-editorial">{children}</div>
  </Section>
);

const ChapterHeader = ({ className, ...props }: ComponentPropsWithoutRef<'header'>) => (
  <header className={cn('mb-18 flex flex-col items-center text-center', className)} {...props} />
);

const ChapterNumber = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mb-4 font-heading text-[18px] italic font-light tracking-[0.2em] text-gold',
      className,
    )}
    {...props}
  />
);

const ChapterTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
  <h2
    className={cn(
      'font-heading text-[clamp(48px,7vw,96px)] italic font-normal leading-none tracking-[-0.015em] text-current',
      className,
    )}
    {...props}
  />
);

const ChapterSubtitle = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mt-4 font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-gold',
      className,
    )}
    {...props}
  />
);

const ChapterCaption = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mx-auto mt-5 max-w-135 font-heading text-[18px] italic leading-[1.6] text-current opacity-80',
      className,
    )}
    {...props}
  />
);

const revealOverlayVariants = cva(
  'pointer-events-none absolute -inset-x-px -bottom-1 flex h-80 items-end justify-center pb-2',
  {
    variants: {
      tone: {
        paper: 'bg-linear-to-b from-transparent to-paper',
        'paper-deep': 'bg-linear-to-b from-transparent to-paper-deep',
        ink: 'bg-linear-to-b from-transparent to-ink',
        night: 'bg-linear-to-b from-transparent to-night',
      },
    },
    defaultVariants: { tone: 'paper' },
  },
);

const revealButtonVariants = cva(
  'pointer-events-auto inline-flex flex-col items-center gap-1.5 border px-10 py-4 backdrop-blur-sm transition-[background-color,border-color,translate] duration-300 hover:-translate-y-0.5',
  {
    variants: {
      tone: {
        paper: 'border-gold/40 bg-paper/40 text-ink hover:border-gold/70 hover:bg-paper/80',
        'paper-deep':
          'border-gold/40 bg-paper-deep/40 text-ink hover:border-gold/70 hover:bg-paper-deep/80',
        ink: 'border-gold/60 bg-ink/40 text-paper hover:border-gold/90 hover:bg-ink/80',
        night: 'border-gold/60 bg-night/40 text-paper hover:border-gold/90 hover:bg-night/80',
      },
    },
    defaultVariants: { tone: 'paper' },
  },
);

type ChapterRevealProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof revealButtonVariants> & {
    remaining: number;
  };

const ChapterReveal = ({ tone, remaining, className, ...props }: ChapterRevealProps) => (
  <div className={revealOverlayVariants({ tone })}>
    <button className={cn(revealButtonVariants({ tone }), className)} {...props}>
      <span className="font-heading text-[20px] italic font-normal">Feuilleter le chapitre</span>
      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] opacity-70">
        Encore {remaining.toLocaleString('fr-FR')} souvenirs
      </span>
    </button>
  </div>
);

export const Chapter = {
  Root: ChapterRoot,
  Header: ChapterHeader,
  Number: ChapterNumber,
  Title: ChapterTitle,
  Subtitle: ChapterSubtitle,
  Caption: ChapterCaption,
  Reveal: ChapterReveal,
};
