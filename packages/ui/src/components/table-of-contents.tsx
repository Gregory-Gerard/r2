import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const TableOfContentsRoot = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={cn('mx-auto max-w-toc', className)} {...props} />
);

const TableOfContentsHeader = ({ className, ...props }: ComponentPropsWithoutRef<'header'>) => (
  <header className={cn('mb-20 text-center', className)} {...props} />
);

const TableOfContentsTitle = ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
  <h2
    className={cn(
      'font-heading text-[clamp(48px,6vw,80px)] italic font-normal leading-none tracking-[-0.01em] text-ink',
      className,
    )}
    {...props}
  />
);

const TableOfContentsList = ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
  <ul
    className={cn(
      'flex flex-col border-t border-gold/25 [&>li]:border-b [&>li]:border-gold/25',
      className,
    )}
    {...props}
  />
);

type TableOfContentsRowProps = ComponentPropsWithoutRef<'a'>;

const TableOfContentsRow = ({ className, ...props }: TableOfContentsRowProps) => (
  <li>
    <a
      className={cn(
        'group grid grid-cols-[80px_1fr_auto_auto] items-baseline gap-6 px-2 py-7 text-left',
        'transition-[padding,background-color] duration-400 ease-out',
        'hover:bg-gold/8 hover:pl-6',
        'focus-visible:outline-none focus-visible:bg-gold/8 focus-visible:pl-6',
        'max-md:grid-cols-[50px_1fr] max-md:gap-4',
        className,
      )}
      {...props}
    />
  </li>
);

const TableOfContentsNumber = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn('font-heading text-[22px] italic font-normal text-gold', className)}
    {...props}
  />
);

const TableOfContentsChapter = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn(
      'font-heading text-[clamp(28px,3.4vw,42px)] italic font-normal leading-[1.1] text-ink',
      className,
    )}
    {...props}
  />
);

const TableOfContentsTime = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn(
      'font-sans text-[11px] font-medium uppercase tracking-[0.3em] whitespace-nowrap text-ink-muted max-md:hidden',
      className,
    )}
    {...props}
  />
);

const TableOfContentsCount = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn(
      'min-w-[70px] text-right font-heading text-[15px] italic whitespace-nowrap text-ink-muted max-md:hidden',
      className,
    )}
    {...props}
  />
);

export const TableOfContents = {
  Root: TableOfContentsRoot,
  Header: TableOfContentsHeader,
  Title: TableOfContentsTitle,
  List: TableOfContentsList,
  Row: TableOfContentsRow,
  Number: TableOfContentsNumber,
  Chapter: TableOfContentsChapter,
  Time: TableOfContentsTime,
  Count: TableOfContentsCount,
};
