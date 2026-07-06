"use client";

import { useEffect, useState, useCallback } from "react";
import { Moon, Sun, Monitor, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";

type ThemeChoice = "light" | "dark" | "system";

const THEME_KEY = "theme";
const PREMIUM_KEY = "ra_premium";

function applyTheme(choice: ThemeChoice) {
  const el = document.documentElement;
  if (choice === "system") el.removeAttribute("data-theme");
  else el.setAttribute("data-theme", choice);
}

function applyPremium(on: boolean) {
  const el = document.documentElement;
  if (on) el.setAttribute("data-premium", "on");
  else el.removeAttribute("data-premium");
}

const options: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeChoice>("system");
  const [premium, setPremium] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    setTheme(stored === "dark" || stored === "light" ? stored : "system");
    setPremium(localStorage.getItem(PREMIUM_KEY) === "on");

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const chooseTheme = useCallback((choice: ThemeChoice) => {
    setTheme(choice);
    applyTheme(choice);
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  }, []);

  const togglePremium = useCallback(() => {
    setPremium((prev) => {
      const next = !prev;
      applyPremium(next);
      if (next) localStorage.setItem(PREMIUM_KEY, "on");
      else localStorage.removeItem(PREMIUM_KEY);
      return next;
    });
  }, []);

  // Icon reflects the *effective* appearance.
  const effectiveDark = theme === "dark" || (theme === "system" && systemDark);
  const TriggerIcon = theme === "system" ? Monitor : effectiveDark ? Moon : Sun;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Appearance settings">
              <TriggerIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Appearance</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => chooseTheme(option.value)}
          >
            <option.icon className="h-4 w-4" />
            <span className="flex-1">{option.label}</span>
            {theme === option.value && <Check className="h-4 w-4 text-[var(--primary)]" />}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            togglePremium();
          }}
        >
          <Sparkles className={cn("h-4 w-4", premium && "text-[var(--primary)]")} />
          <span className="flex-1">Premium visuals</span>
          <span
            className={cn(
              "text-xs font-medium",
              premium ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
            )}
          >
            {premium ? "On" : "Off"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
