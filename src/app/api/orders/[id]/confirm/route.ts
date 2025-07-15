import { NextRequest, NextResponse } from "next/server";
import { confirmOrder } from "@/lib/actions/orders";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approve, adminNotes, confirmedBy } = body;

    const result = await confirmOrder({
      orderId: id,
      approve,
      adminNotes,
      confirmedBy,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in confirm order API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
