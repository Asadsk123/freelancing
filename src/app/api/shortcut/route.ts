import { type NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") ?? "dashboard";
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://royal-asad.vercel.app";

  const urls: Record<string, { path: string; name: string }> = {
    admin: { path: "/admin/dashboard", name: "ROYAL-ASAD Admin" },
    dashboard: { path: "/dashboard", name: "ROYAL-ASAD Dashboard" },
  };

  const target = urls[page] ?? urls["dashboard"]!;
  const url = `${base}${target.path}`;

  // Windows .url shortcut format
  const content = `[InternetShortcut]\r\nURL=${url}\r\n`;
  const name = target.name;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${name}.url"`,
    },
  });
}
