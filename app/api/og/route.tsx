import {ImageResponse} from "next/og";

export async function GET() {
    return new ImageResponse(
        (
            <h1
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    fontSize: "3rem",
                    fontWeight: "bolder",
                    color: "#fff",
                    backgroundColor: "#000"
                }}
            >
                ©NEVERBE
            </h1>
        ),
        {
            width: 300,
            height: 300,

        },
    );
}