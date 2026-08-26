import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    // Home-screen label — spec recommends keeping this short (~12 chars).
    short_name: "ROYAL-ASAD",
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4c6ef5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Admin Dashboard",
        short_name: "Admin",
        description: "Open the admin control panel",
        url: "/admin/dashboard",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
      {
        name: "Client Dashboard",
        short_name: "Dashboard",
        description: "Open your client dashboard",
        url: "/dashboard",
        icons: [{ src: "/icon.svg", sizes: "any" }],
      },
    ],
  };
}
