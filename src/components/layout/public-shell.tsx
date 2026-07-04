"use client";

import { useState, useCallback } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleMobileMenuOpen = useCallback(() => {
    setMobileNavOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  return (
    <>
      <Header onMobileMenuOpen={handleMobileMenuOpen} />
      <MobileNav open={mobileNavOpen} onClose={handleMobileMenuClose} />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
      <Footer />
    </>
  );
}
