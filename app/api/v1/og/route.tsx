import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET(req: NextRequest) {
  const imageUrl = "https://neverbe.lk/logo-og.png";
  let imageDataUrl: string | null = null;

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(arrayBuffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      imageDataUrl = `data:image/png;base64,${btoa(binary)}`;
    }
  } catch (e) {
    console.error("Error fetching OG Image:", e);
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundColor: "#000",
          fontFamily: "sans-serif",
          fontSize: 40,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            alt="NEVERBE"
            style={{
              height: "80%",
              width: "80%",
              objectFit: "contain",
              borderRadius: "24px",
            }}
          />
        ) : (
          <div style={{ fontSize: 40, color: "white" }}>NEVERBE</div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
