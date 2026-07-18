import { ImageResponse } from "next/og";
import { brand } from "@/config/brand";

export const runtime = "edge";
export const alt = brand.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e2761 0%, #4c6ef5 100%)",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 28,
            background: "rgba(255,255,255,0.15)",
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          RA
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -2 }}>ROYAL-ASAD</div>
        <div style={{ fontSize: 40, fontWeight: 600, marginTop: 8 }}>AI &amp; Digital Solutions</div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.9 }}>{brand.tagline}</div>
      </div>
    ),
    size,
  );
}
