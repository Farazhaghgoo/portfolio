import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fonts = join(process.cwd(), "node_modules/@fontsource");

// Read once at module scope so the image is generated at build time.
const [sans, mono, serif, serifItalic] = await Promise.all([
  readFile(join(fonts, "geist-sans/files/geist-sans-latin-600-normal.woff")),
  readFile(join(fonts, "geist-mono/files/geist-mono-latin-400-normal.woff")),
  readFile(join(fonts, "instrument-serif/files/instrument-serif-latin-400-normal.woff")),
  readFile(join(fonts, "instrument-serif/files/instrument-serif-latin-400-italic.woff")),
]);

export default async function OpengraphImage() {
  const paper = "#f1eee6";
  const ink = "#131312";
  const muted = "#67645b";
  const blue = "#2440ff";
  const meta = { fontFamily: "Mono", fontSize: 18, letterSpacing: 0.8, color: muted, textTransform: "uppercase" as const };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: paper, color: ink, padding: "48px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...meta }}>
          <span>
            <span style={{ color: ink }}>FH</span>—000 / Index
          </span>
          <span>45.0703° N 7.6869° E</span>
          <span>
            {profile.location.city}, {profile.location.country}
          </span>
        </div>

        <div style={{ display: "flex", marginTop: 64, fontFamily: "Geist", fontSize: 168, letterSpacing: -10, lineHeight: 0.9 }}>
          {profile.name}
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `1.5px solid ${ink}`, paddingTop: 22 }}>
          <div style={{ display: "flex", fontFamily: "Serif", fontSize: 54, letterSpacing: -1, lineHeight: 1 }}>
            I build systems,&nbsp;<span style={{ fontFamily: "Serif Italic" }}>products</span>&nbsp;and interfaces.
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ width: 44, height: 16, background: ink }} />
              <div style={{ width: 34, height: 16, background: blue, marginLeft: 10 }} />
            </div>
            <span style={meta}>Software / Product / AI</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 600, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
        { name: "Serif", data: serif, weight: 400, style: "normal" },
        { name: "Serif Italic", data: serifItalic, weight: 400, style: "italic" },
      ],
    },
  );
}
