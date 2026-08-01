import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SITE_NAME = process.env.SITE_NAME ?? "DevTyp.i.ng";

export default function Image() {
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
          backgroundColor: "#0f172a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "monospace",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 36,
            fontFamily: "monospace",
            color: "#94a3b8",
            marginTop: 24,
          }}
        >
          Improvement through repetition
        </div>
      </div>
    ),
    size,
  );
}
