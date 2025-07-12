import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      salesRepId,
      storeId,
      visitPurpose,
      notes,
      latitude,
      longitude,
      photos,
    } = body;

    // Validate required fields
    if (!salesRepId || !storeId || !visitPurpose || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create field visit
    const fieldVisit = await prisma.fieldVisit.create({
      data: {
        salesRepId,
        storeId,
        visitPurpose,
        notes: notes || null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        photos: photos || [],
        checkInTime: new Date(),
        visitDate: new Date(),
      },
      include: {
        salesRep: true,
        store: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: fieldVisit,
      message: "Check-in berhasil disimpan ke database!",
    });
  } catch (error) {
    console.error("Error creating field visit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const salesRepId = searchParams.get("salesRepId");

    const fieldVisits = await prisma.fieldVisit.findMany({
      where: salesRepId ? { salesRepId } : {},
      include: {
        salesRep: true,
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: fieldVisits,
    });
  } catch (error) {
    console.error("Error fetching field visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
