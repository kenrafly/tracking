"use server";

import { prisma } from "@/lib/prisma";

export async function getStores() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: stores,
    };
  } catch (error) {
    console.error("Error fetching stores:", error);
    return {
      success: false,
      error: "Internal server error",
      data: [],
    };
  }
}

export async function getSalesReps() {
  try {
    const salesReps = await prisma.salesRepresentative.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: salesReps,
    };
  } catch (error) {
    console.error("Error fetching sales representatives:", error);
    return {
      success: false,
      error: "Internal server error",
      data: [],
    };
  }
}
