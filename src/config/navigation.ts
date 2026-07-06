/**
 * Maps a public route href to its i18n key under the `nav` namespace, so nav
 * labels are translated rather than hardcoded. New links only need an entry here.
 */
const NAV_KEY_BY_HREF: Record<string, string> = {
  "/services": "nav.services",
  "/portfolio": "nav.portfolio",
  "/blog": "nav.blog",
  "/about": "nav.about",
  "/contact": "nav.contact",
};

export function navKeyForHref(href: string): string {
  return NAV_KEY_BY_HREF[href] ?? href;
}

export const publicNavigation = {
  main: [
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footer: {
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Security", href: "/security" },
    ],
  },

  cta: {
    label: "Get a Quote",
    href: "/contact?form=quote",
  },
} as const;

export const portalNavigation = {
  main: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Projects", href: "/projects", icon: "folder" },
    { label: "Notifications", href: "/notifications", icon: "bell" },
    { label: "Settings", href: "/settings", icon: "settings" },
  ],

  mobile: [
    { label: "Dashboard", href: "/dashboard", icon: "home" },
    { label: "Projects", href: "/projects", icon: "folder" },
    { label: "Files", href: "/files", icon: "download" },
    { label: "Notifications", href: "/notifications", icon: "bell" },
  ],
} as const;

export const adminNavigation = {
  main: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "layout-dashboard" },
    { label: "Projects", href: "/admin/projects", icon: "folder" },
    { label: "Clients", href: "/admin/clients", icon: "users" },
    { label: "Services", href: "/admin/services", icon: "layers" },
    { label: "Blog", href: "/admin/blog", icon: "file-text" },
    { label: "Inquiries", href: "/admin/inquiries", icon: "inbox" },
    { label: "Reviews", href: "/admin/reviews", icon: "star" },
    { label: "Settings", href: "/admin/settings", icon: "settings" },
  ],
} as const;
