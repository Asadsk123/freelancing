"use client";

import { formatRelativeTime } from "@/lib/utils/formatting";

type RelativeTimeProps = {
  date: Date | string;
  className?: string;
};

export function RelativeTime({ date, className }: RelativeTimeProps) {
  const d = typeof date === "string" ? new Date(date) : date;
  return (
    <time dateTime={d.toISOString()} className={className} title={d.toLocaleString()}>
      {formatRelativeTime(d)}
    </time>
  );
}
