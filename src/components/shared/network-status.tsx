"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, WifiLow } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";

type Quality = "excellent" | "good" | "slow" | "offline";

/** Minimal shape of the (non-standard) Network Information API. */
type NetworkInformation = {
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function readConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

function computeQuality(): Quality {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
  const effectiveType = readConnection()?.effectiveType;
  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return "slow";
    case "3g":
      return "good";
    case "4g":
      return "excellent";
    default:
      // API unavailable — assume a healthy connection rather than alarm the user.
      return "excellent";
  }
}

const META: Record<Quality, { label: string; hint: string; className: string; Icon: typeof Wifi }> = {
  excellent: {
    label: "Excellent",
    hint: "Your connection looks great.",
    className: "text-[var(--success,#16a34a)]",
    Icon: Wifi,
  },
  good: {
    label: "Good",
    hint: "Your connection is stable.",
    className: "text-[var(--foreground)]",
    Icon: Wifi,
  },
  slow: {
    label: "Slow",
    hint: "Your connection may be affecting loading.",
    className: "text-[var(--warning,#d97706)]",
    Icon: WifiLow,
  },
  offline: {
    label: "Offline",
    hint: "You appear to be offline. We'll reconnect automatically.",
    className: "text-[var(--color-error,#dc2626)]",
    Icon: WifiOff,
  },
};

export function NetworkStatus() {
  // Start "excellent" so server and first client render match (no hydration
  // mismatch); the real value is read in the effect after mount.
  const [quality, setQuality] = useState<Quality>("excellent");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setQuality(computeQuality());
    update();

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    const conn = readConnection();
    conn?.addEventListener?.("change", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      conn?.removeEventListener?.("change", update);
    };
  }, []);

  // Nothing to show until mounted (avoids SSR/client divergence for a dynamic,
  // client-only signal).
  if (!mounted) return null;

  const { label, hint, className, Icon } = META[quality];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn("inline-flex h-9 w-9 items-center justify-center", className)}
          role="status"
          aria-live="polite"
          aria-label={`Network: ${label}. ${hint}`}
          tabIndex={0}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-medium">{label}</span>
        <span className="block text-[var(--background)]/80">{hint}</span>
      </TooltipContent>
    </Tooltip>
  );
}
