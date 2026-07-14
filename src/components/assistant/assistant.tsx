"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [panelPos, setPanelPos] = useState<Point>({ x: 0, y: 0 });

  // All live-drag math lives in a ref so the pointer handlers never depend on
  // the (async) `pos` state — this avoids stale-closure bugs where a drag would
  // persist the old position or be misread as a tap.
  const dragState = useRef({
    dragging: false,
    moved: false,
    startPointerX: 0,
    startPointerY: 0,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });
  const posRef = useRef<Point>({ x: 0, y: 0 });
  posRef.current = pos;
  const mascotRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = dragState.current;
    s.dragging = true;
    s.moved = false;
    s.startPointerX = e.clientX;
    s.startPointerY = e.clientY;
    s.startX = posRef.current.x;
    s.startY = posRef.current.y;
    s.lastX = posRef.current.x;
    s.lastY = posRef.current.y;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s.dragging) return;
    const next = clampToViewport({
      x: s.startX + (e.clientX - s.startPointerX),
      y: s.startY + (e.clientY - s.startPointerY),
    });
    s.lastX = next.x;
    s.lastY = next.y;
    // Once the pointer travels past the threshold, treat the gesture as a drag
    // (so releasing won't be misread as a tap that opens the panel).
    if (
      Math.abs(next.x - s.startX) > DRAG_THRESHOLD ||
      Math.abs(next.y - s.startY) > DRAG_THRESHOLD
    ) {
      s.moved = true;
    }
    setPos(next);
  }, []);

  const onPointerUp = useCallback(() => {
    const s = dragState.current;
    if (!s.dragging) return;
    s.dragging = false;
    if (s.moved) {
      const finalPos = { x: s.lastX, y: s.lastY };
      setPos(finalPos);
      persistPos(finalPos);
    } else {
      // A tap (no drag) toggles the panel.
      setOpen((o) => !o);
    }
  }, [persistPos]);

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

  const closePanel = useCallback(() => {
    setOpen(false);
    mascotRef.current?.focus();
  }, []);

  // Navigate shortly after showing the guide message. The pending timer is
  // tracked so it is cleared on unmount and never stacks on rapid clicks.
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    },
    [],
  );
  const guideTo = useCallback(
    (info: string, path: string) => {
      setMessage(info);
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
      navTimerRef.current = setTimeout(() => router.push(path), 700);
    },
    [router],
  );

  // Accessibility: when the panel opens, move focus into it; Escape closes it
  // and returns focus to the mascot trigger.
  useEffect(() => {
    if (!open) return;
    // Prefer the search input so users can type immediately; fall back to the
    // first focusable control (e.g. on the message view, which has no input).
    const first =
      panelRef.current?.querySelector<HTMLElement>("input") ??
      panelRef.current?.querySelector<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        mascotRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Position the panel near the mascot but always fully within the viewport.
  // Runs before paint (measures the real panel size, which varies with content).
  useLayoutEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const pw = panel.offsetWidth;
    const ph = panel.offsetHeight;
    const gap = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer above the mascot; drop below if there isn't room above.
    let top = pos.y - ph - gap;
    if (top < 8) top = pos.y + MASCOT_SIZE + gap;
    top = Math.min(Math.max(8, top), Math.max(8, vh - ph - 8));

    let left = pos.x + MASCOT_SIZE / 2 - pw / 2;
    left = Math.min(Math.max(8, left), Math.max(8, vw - pw - 8));

    setPanelPos({ x: left, y: top });
  }, [open, pos, message]);

  const guides = [
    { key: "assistant.guideServices", run: () => guideTo(t("assistant.servicesInfo"), "/services") },
    { key: "assistant.guideContact", run: () => guideTo(t("assistant.contactInfo"), "/contact?form=quote") },
    { key: "assistant.guideDashboard", run: () => guideTo(t("assistant.dashboardInfo"), "/dashboard") },
    { key: "assistant.quickPortfolio", run: () => guideTo(t("assistant.portfolioInfo"), "/portfolio") },
    { key: "assistant.quickBlog", run: () => guideTo(t("assistant.blogInfo"), "/blog") },
    { key: "assistant.quickNotifications", run: () => guideTo(t("assistant.notificationsInfo"), "/notifications") },
    { key: "assistant.quickSettings", run: () => guideTo(t("assistant.settingsInfo"), "/settings") },
    { key: "assistant.explainMilestones", run: () => setMessage(t("assistant.milestonesInfo")) },
    { key: "assistant.explainUploads", run: () => setMessage(t("assistant.uploadsInfo")) },
    { key: "assistant.explainPage", run: () => setMessage(t("assistant.pageInfo")) },
  ];

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGuides = normalizedQuery
    ? guides.filter((g) => t(g.key).toLowerCase().includes(normalizedQuery))
    : guides.slice(0, 6);

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
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label={t("assistant.name")}
          className="pointer-events-auto fixed w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] shadow-[var(--shadow-lg)]"
          style={{ left: panelPos.x, top: panelPos.y }}
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
              <button type="button" onClick={closePanel} aria-label={t("assistant.close")} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
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
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("assistant.searchPlaceholder")}
                  aria-label={t("assistant.searchPlaceholder")}
                  className="mt-3 w-full rounded-[var(--radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                />
                <div className="mt-3 flex max-h-64 flex-col gap-1.5 overflow-y-auto">
                  {visibleGuides.length === 0 ? (
                    <p className="px-1 py-2 text-xs text-[var(--muted-foreground)]">{t("assistant.noResults")}</p>
                  ) : (
                    visibleGuides.map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => {
                          setQuery("");
                          g.run();
                        }}
                        className="rounded-[var(--radius-md)] border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:border-[var(--primary)] hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]"
                      >
                        {t(g.key)}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Draggable mascot */}
      <button
        ref={mascotRef}
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={(e) => {
          // Pointer handlers cover mouse/touch; keyboard activation (Enter/Space)
          // fires a click, not pointer events, so handle it explicitly here.
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
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
