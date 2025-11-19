import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {

    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("[Settings API] Error:", error.message, error.stack);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
