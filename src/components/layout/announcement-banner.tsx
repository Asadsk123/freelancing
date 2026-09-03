"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

// 48 hours from when this banner was first deployed
const OFFER_END = new Date("2026-09-05T00:00:00Z").getTime();
const STORAGE_KEY = "ra_banner_dismissed";

function getTimeLeft() {
  const diff = OFFER_END - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}
    setVisible(true);

    const id = setInterval(() => {
      const t = getTimeLeft();
      setTime(t);
      if (!t) setVisible(false);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function dismiss() {
    try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
    setVisible(false);
  }

  if (!visible || !time) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="relative z-50 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-center">
        <Zap className="w-4 h-4 shrink-0 text-yellow-300" />
        <p className="font-medium">
          <span className="font-bold text-yellow-300">🎉 LIMITED TIME FREE OFFER — </span>
          Ham abhi sirf{" "}
          <span className="font-bold underline underline-offset-2">FREE</span>{" "}
          mein professional websites bana ke de rahe hain!{" "}
          <span className="hidden sm:inline">
            Aaj hi contact karo — offer sirf{" "}
          </span>
          <span className="sm:hidden">Sirf </span>
          <span className="font-bold text-yellow-300 tabular-nums">
            {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
          </span>{" "}
          mein khatam!
        </p>
        <a
          href="/contact"
          className="shrink-0 bg-white text-purple-700 font-bold text-xs px-3 py-1 rounded-full hover:bg-yellow-300 hover:text-purple-900 transition-colors"
        >
          Abhi Lao →
        </a>
        <button
          onClick={dismiss}
          aria-label="Close"
          className="shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
