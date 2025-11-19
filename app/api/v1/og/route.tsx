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
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      let binary = '';
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
          backgroundColor: "#000", // Solid black background for simplicity
          fontFamily: 'sans-serif',
          fontSize: 60, // Default font size for general text
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1C1C1C", // Slightly lighter dark grey for the card
            borderRadius: "40px", // Main card rounding
            padding: "50px 70px", // Adjusted padding for a tighter look
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)", // Softer shadow
            textAlign: "center",
            width: "550px", // Fixed width to match aspect ratio in image
            height: "400px", // Fixed height to match aspect ratio in image
            overflow: "hidden", // Ensure nothing spills out
          }}
        >
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="NEVERBE"
              style={{
                height: "100%", // Let the image take up the full height of its container
                width: "100%",  // Let the image take up the full width of its container
                objectFit: "contain", // Keep aspect ratio, center it
                borderRadius: "24px", // Applied to the image itself
              }}
            />
          ) : (
            // Fallback text if image fails to load
            <div style={{ fontSize: 60, color: 'white' }}>
              NEVERBE
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}