import { PublicShell } from "@/components/layout/public-shell";
import { Footer } from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicShell>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
      </PublicShell>
      <Footer />
    </>
  );
}
