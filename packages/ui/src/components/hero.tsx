import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '#/lib/utils.ts';

const HeroRoot = ({ className, ...props }: ComponentPropsWithoutRef<'section'>) => (
  <section
    className={cn(
      'relative grid h-dvh min-h-160 w-full grid-rows-[auto_1fr_auto] overflow-hidden bg-night text-paper',
      className,
    )}
    {...props}
  />
);

type HeroImageProps = ComponentPropsWithoutRef<'div'> & {
  src: string;
  alt?: string;
  position?: string;
};

const HeroImage = ({
  src,
  alt,
  position = 'center 40%',
  style,
  className,
  ...props
}: HeroImageProps) => (
  <div
    role={alt ? 'img' : 'presentation'}
    aria-label={alt}
    className={cn('absolute inset-0 bg-cover filter-[saturate(1.05)_contrast(1.02)]', className)}
    style={{ backgroundImage: `url(${src})`, backgroundPosition: position, ...style }}
    {...props}
  />
);

const HeroVignette = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    aria-hidden
    className={cn(
      'absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_30%,rgb(20_10_5/0.55)_100%),linear-gradient(to_bottom,rgb(20_10_5/0.25)_0%,transparent_25%,transparent_60%,rgb(20_10_5/0.65)_100%)]',
      className,
    )}
    {...props}
  />
);

const HeroNav = ({ className, ...props }: ComponentPropsWithoutRef<'nav'>) => (
  <nav
    className={cn(
      'relative z-5 row-start-1 flex items-center justify-between gap-4 px-12 py-7 text-[11px] font-normal uppercase tracking-[0.28em] text-paper/85 max-md:px-6 max-md:py-4',
      className,
    )}
    {...props}
  />
);

const HeroNavItem = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span className={cn('min-w-0 flex-1 truncate', className)} {...props} />
);

const HeroNavMeta = ({ className, ...props }: ComponentPropsWithoutRef<'span'>) => (
  <span
    className={cn(
      'min-w-0 flex-1 truncate text-center font-heading text-sm italic tracking-[0.18em] normal-case max-md:hidden',
      className,
    )}
    {...props}
  />
);

const HeroContent = ({ className, ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'relative z-4 row-start-2 flex min-h-0 flex-col items-center justify-center px-6 text-center text-paper',
      className,
    )}
    {...props}
  />
);

const HeroOverline = ({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mb-[clamp(24px,4vh,48px)] font-heading text-[clamp(15px,1.5vw,20px)] italic font-normal tracking-[0.06em] text-cream/85',
      className,
    )}
    {...props}
  >
    <span aria-hidden className="mr-4 text-cream/60">
      ·
    </span>
    {children}
    <span aria-hidden className="ml-4 text-cream/60">
      ·
    </span>
  </p>
);

const HeroTitle = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'mt-[clamp(20px,3.5vh,40px)] font-heading text-[clamp(20px,2.4vw,32px)] italic font-normal tracking-[0.04em] text-cream',
      className,
    )}
    {...props}
  />
);

const HeroDate = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p
    className={cn(
      'font-sans text-[11px] font-normal uppercase tracking-[0.42em] text-cream/85',
      className,
    )}
    {...props}
  />
);

type HeroScrollProps = ComponentPropsWithoutRef<'div'> & {
  label: string;
};

const HeroScroll = ({ label, className, ...props }: HeroScrollProps) => (
  <div
    className={cn('relative z-5 row-start-3 mb-9 text-center text-paper/70', className)}
    {...props}
  >
    <p className="mb-2.5 font-heading text-sm italic">{label}</p>
    <span
      aria-hidden
      className="mx-auto block h-9 w-px animate-scroll-line bg-linear-to-b from-paper/70 to-transparent"
    />
  </div>
);

export const Hero = {
  Root: HeroRoot,
  Image: HeroImage,
  Vignette: HeroVignette,
  Nav: HeroNav,
  NavItem: HeroNavItem,
  NavMeta: HeroNavMeta,
  Content: HeroContent,
  Overline: HeroOverline,
  Title: HeroTitle,
  Date: HeroDate,
  Scroll: HeroScroll,
};
