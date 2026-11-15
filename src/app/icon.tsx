import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 20,
        background: "#0c0c0c",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        borderRadius: "20%",
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
