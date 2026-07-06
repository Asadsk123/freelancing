"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, X, EyeOff, Pause, Play, ArrowLeft, MessageCircle } from "lucide-react";
import { useTranslations } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils/cn";

const POS_KEY = "ra_assistant_pos";
const HIDDEN_KEY = "ra_assistant_hidden";
const PAUSED_KEY = "ra_assistant_paused";
const WELCOME_KEY = "ra_assistant_welcome";

const MASCOT_SIZE = 56;
const DRAG_THRESHOLD = 6; // px before a press becomes a drag rather than a click

type Point = { x: number; y: number };

function clampToViewport(p: Point): Point {
  if (typeof window === "undefined") return p;
  const maxX = window.innerWidth - MASCOT_SIZE - 8;
  const maxY = window.innerHeight - MASCOT_SIZE - 8;
  return {
    x: Math.min(Math.max(8, p.x), Math.max(8, maxX)),
    y: Math.min(Math.max(8, p.y), Math.max(8, maxY)),
  };
}

export function Assistant() {
  const router = useRouter();
  const t = useTranslations();

  const [ready, setReady] = useState(false);
  const [pos, setPos] = useState<Point>({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const dragState = useRef<{ dragging: boolean; moved: boolean; offset: Point }>({
    dragging: false,
    moved: false,
    offset: { x: 0, y: 0 },
  });

  // Initialize from storage + defaults (client-only; component is lazy-loaded).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    setHidden(localStorage.getItem(HIDDEN_KEY) === "1");
    setPaused(localStorage.getItem(PAUSED_KEY) === "1");

    const stored = localStorage.getItem(POS_KEY);
    if (stored) {
      try {
        setPos(clampToViewport(JSON.parse(stored) as Point));
      } catch {
        setPos(clampToViewport({ x: window.innerWidth, y: window.innerHeight }));
      }
    } else {
      setPos(clampToViewport({ x: window.innerWidth, y: window.innerHeight }));
    }

    // Post-OTP welcome: opens once with a friendly tour offer.
    if (localStorage.getItem(WELCOME_KEY) === "1") {
      localStorage.removeItem(WELCOME_KEY);
      setHidden(false);
      setOpen(true);
      setMessage(t("assistant.welcome"));
    }

    setReady(true);
    return () => mq.removeEventListener("change", onMq);
  }, [t]);

  // Keep the mascot on-screen when the viewport resizes.
  useEffect(() => {
    if (!ready) return;
    const onResize = () => setPos((p) => clampToViewport(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready]);

  const persistPos = useCallback((p: Point) => {
    localStorage.setItem(POS_KEY, JSON.stringify(p));
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      dragState.current = {
        dragging: true,
        moved: false,
        offset: { x: e.clientX - pos.x, y: e.clientY - pos.y },
      };
    },
    [pos],
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s.dragging) return;
    const next = clampToViewport({
      x: e.clientX - s.offset.x,
      y: e.clientY - s.offset.y,
    });
    // Once the pointer travels past the threshold, treat the gesture as a drag
    // (so releasing won't be misread as a tap that opens the panel).
    if (Math.abs(next.x - pos.x) > DRAG_THRESHOLD || Math.abs(next.y - pos.y) > DRAG_THRESHOLD) {
      s.moved = true;
    }
    setPos(next);
  }, [pos]);

  const onPointerUp = useCallback(() => {
    const s = dragState.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.moved) {
      persistPos(pos);
    } else {
      // A tap (no drag) toggles the panel.
      setOpen((o) => !o);
    }
  }, [pos, persistPos]);

  const toggleHidden = useCallback(() => {
    setHidden((h) => {
      const next = !h;
      localStorage.setItem(HIDDEN_KEY, next ? "1" : "0");
      if (next) setOpen(false);
      return next;
    });
  }, []);

  const togglePaused = useCallback(() => {
    setPaused((p) => {
      const next = !p;
      localStorage.setItem(PAUSED_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  const guides = [
    { key: "assistant.guideServices", run: () => { setMessage(t("assistant.servicesInfo")); setTimeout(() => router.push("/services"), 700); } },
    { key: "assistant.guideContact", run: () => { setMessage(t("assistant.contactInfo")); setTimeout(() => router.push("/contact?form=quote"), 700); } },
    { key: "assistant.guideDashboard", run: () => { setMessage(t("assistant.dashboardInfo")); setTimeout(() => router.push("/dashboard"), 700); } },
    { key: "assistant.explainMilestones", run: () => setMessage(t("assistant.milestonesInfo")) },
    { key: "assistant.explainUploads", run: () => setMessage(t("assistant.uploadsInfo")) },
    { key: "assistant.explainPage", run: () => setMessage(t("assistant.pageInfo")) },
  ];

  if (!ready) return null;

  // Hidden → a small launcher so the user can bring the assistant back.
  if (hidden) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[60]">
        <button
          type="button"
          onClick={toggleHidden}
          aria-label={t("assistant.show")}
          className="pointer-events-auto fixed bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] shadow-[var(--shadow-lg)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    );
  }

  const animate = !paused && !reducedMotion;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-live="polite">
      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t("assistant.name")}
          className="pointer-events-auto fixed w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--shadow-lg)]"
          style={{
            left: Math.min(pos.x, (typeof window !== "undefined" ? window.innerWidth : 400) - 340),
            top: Math.max(8, pos.y - 260),
          }}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--primary)]">
                <Bot className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">{t("assistant.name")}</span>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={togglePaused} aria-label={paused ? t("assistant.resume") : t("assistant.pause")} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
              <button type="button" onClick={toggleHidden} aria-label={t("assistant.hide")} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
                <EyeOff className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("assistant.close")} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3">
            {message ? (
              <div className="space-y-3">
                <p className="text-sm text-[var(--foreground)]">{message}</p>
                <button type="button" onClick={() => setMessage(null)} className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline">
                  <ArrowLeft className="h-3 w-3" />
                  {t("assistant.back")}
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-[var(--foreground)]">{t("assistant.greeting")}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{t("assistant.prompt")}</p>
                <div className="mt-3 flex flex-col gap-1.5">
                  {guides.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={g.run}
                      className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                    >
                      {t(g.key)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Draggable mascot */}
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        aria-label={open ? t("assistant.close") : t("assistant.open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "pointer-events-auto fixed flex items-center justify-center rounded-full",
          "border border-[var(--border)] bg-[var(--primary)] text-[var(--primary-foreground)]",
          "shadow-[var(--shadow-lg)] touch-none select-none cursor-grab active:cursor-grabbing",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
          animate && "ra-assistant-bob",
        )}
        style={{ left: pos.x, top: pos.y, width: MASCOT_SIZE, height: MASCOT_SIZE }}
      >
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
