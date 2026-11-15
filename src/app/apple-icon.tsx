import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 120,
        background: "#0c0c0c",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        borderRadius: "22%",
        fontWeight: 800,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      T
    </div>,
    {
      ...size,
    },
  );
}
