import { NextResponse } from "next/server";
import { scanHardware } from "@/lib/hardware";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const machine = await scanHardware();
    return NextResponse.json(machine);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "hardware scan failed" },
      { status: 500 },
    );
  }
}
