export const theme = {
  colors: {
    brand: {
      50: "#f0f4ff",
      100: "#dbe4ff",
      200: "#bac8ff",
      300: "#91a7ff",
      400: "#748ffc",
      500: "#5c7cfa",
      600: "#4c6ef5",
      700: "#4263eb",
      800: "#3b5bdb",
      900: "#364fc7",
      950: "#1e3a8a",
    },
  },

  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  },

  layout: {
    maxWidth: "1280px",
    headerHeight: "64px",
    sidebarWidth: "260px",
    mobileBreakpoint: "768px",
  },

  direction: "ltr" as "ltr" | "rtl",
} as const;
