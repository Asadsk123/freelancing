"use client";

import { formatDate } from "@/lib/utils/formatting";

type DateDisplayProps = {
  date: Date | string;
  locale?: string;
  className?: string;
};

export function DateDisplay({ date, locale, className }: DateDisplayProps) {
  const d = typeof date === "string" ? new Date(date) : date;
  return (
    <time dateTime={d.toISOString()} className={className}>
      {formatDate(d, locale)}
    </time>
  );
}
