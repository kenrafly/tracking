import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const salesReps = await prisma.salesRepresentative.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: salesReps,
    });
  } catch (error) {
    console.error("Error fetching sales representatives:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
