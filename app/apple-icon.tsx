import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf6ee",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "6px solid #c9a45c",
          borderRadius: "50%",
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2c4a6e"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#b8892f",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
