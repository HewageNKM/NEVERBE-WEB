import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
        }}
      >
        <img
          src="https://neverbe.lk/logo-og.png"
          alt="NEVERBE"
          style={{
            width: "70%",
            height: "auto",
            borderRadius: "1rem",
          }}
        />
      </div>
    ),
    size
  );
}
