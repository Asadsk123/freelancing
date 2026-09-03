"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";
import { AnnouncementBanner } from "./announcement-banner";

export function PublicShell({
  children,
  dashboardHref = "/login",
}: {
  children: React.ReactNode;
  dashboardHref?: string;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileMenuOpen = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  return (
    <>
      <AnnouncementBanner />
      <Header onMobileMenuOpen={handleMobileMenuOpen} dashboardHref={dashboardHref} />
      <MobileNav open={mobileNavOpen} onClose={handleMobileMenuClose} />
      {children}
    </>
  );
}
