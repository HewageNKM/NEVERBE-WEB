import {ImageResponse} from "next/og";

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    fontSize: "3rem",
                    fontWeight: "bolder",
                    color: "#fff",
                    borderRadius: "9999px",
                    backgroundColor: "#97E13E",
                }}
            >
                ©NEVERBE
            </div>
        ),
        {
            width: 260,
            height: 260,

        },
    );
}