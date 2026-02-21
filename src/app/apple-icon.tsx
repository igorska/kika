import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: "#A1245B",
        width: 180,
        height: 180,
        borderRadius: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 110,
        fontWeight: 700,
      }}
    >
      К
    </div>
  );
}
