import { useMemo } from 'react';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const useDaysSince = (date: Date) =>
  useMemo(() => {
    const diff = Date.now() - date.getTime();
    return Math.max(0, Math.floor(diff / MS_PER_DAY));
  }, [date]);
