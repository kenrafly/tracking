"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export async function createOrder({
  salesRepId,
  storeId,
  storeName,
  storeAddress,
  customerName,
  customerEmail,
  customerPhone,
  items,
  notes,
  requiresConfirmation = false,
}: {
  salesRepId: string;
  storeId?: string;
  storeName?: string;
  storeAddress?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: OrderItem[];
  notes?: string;
  requiresConfirmation?: boolean;
}) {
  try {
    // Validate required fields
    if (
      !salesRepId ||
      (!storeId && !storeName) ||
      !customerName ||
      !items ||
      items.length === 0
    ) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: OrderItem) => {
      return sum + item.quantity * item.price;
    }, 0);

    let finalStoreId: string = storeId || "";

    // Handle store creation if needed
    if (!storeId && storeName) {
      const existingStore = await prisma.store.findFirst({
        where: {
          name: {
            equals: storeName,
            mode: "insensitive",
          },
        },
      });

      if (existingStore) {
        finalStoreId = existingStore.id;
      } else {
        const newStore = await prisma.store.create({
          data: {
            name: storeName,
            address:
              storeAddress ||
              `Alamat belum diverifikasi (${new Date().toLocaleDateString()})`,
          },
        });
        finalStoreId = newStore.id;
      }
    }

    // Handle customer creation
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        AND: [
          { name: { equals: customerName, mode: "insensitive" } },
          { storeId: finalStoreId },
        ],
      },
    });

    let finalCustomerId: string;

    if (existingCustomer) {
      finalCustomerId = existingCustomer.id;
    } else {
      const newCustomer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail || null,
          phone: customerPhone || null,
          storeId: finalStoreId,
        },
      });
      finalCustomerId = newCustomer.id;
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: finalCustomerId,
        storeId: finalStoreId,
        salesRepId,
        totalAmount,
        status: requiresConfirmation ? "PENDING_CONFIRMATION" : "NEW",
        requiresConfirmation,
        notes: notes || null,
        orderDate: new Date(),
        items: {
          create: items.map((item: OrderItem) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })),
        },
      },
      include: {
        customer: true,
        store: true,
        salesRep: true,
        items: true,
      },
    });

    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    return {
      success: true,
      data: order,
      message: requiresConfirmation
        ? "Order berhasil dibuat dan menunggu konfirmasi admin!"
        : "Order berhasil dibuat!",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

export async function getOrders({
  salesRepId,
  status,
  requiresConfirmation,
}: {
  salesRepId?: string;
  status?: string;
  requiresConfirmation?: boolean;
} = {}) {
  try {
    const where: Record<string, unknown> = {};

    if (salesRepId) {
      where.salesRepId = salesRepId;
    }

    if (status) {
      where.status = status;
    }

    if (requiresConfirmation !== undefined) {
      where.requiresConfirmation = requiresConfirmation;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        store: true,
        salesRep: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: orders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "Internal server error",
      data: [],
    };
  }
}

export async function confirmOrder({
  orderId,
  approve,
  adminNotes,
  confirmedBy,
}: {
  orderId: string;
  approve: boolean;
  adminNotes?: string;
  confirmedBy: string;
}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: approve ? "NEW" : "CANCELED",
        confirmedAt: new Date(),
        confirmedBy,
        adminNotes: adminNotes || null,
      },
      include: {
        customer: true,
        store: true,
        salesRep: true,
        items: true,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/orders");

    return {
      success: true,
      data: updatedOrder,
      message: approve
        ? "Order berhasil dikonfirmasi!"
        : "Order berhasil ditolak!",
    };
  } catch (error) {
    console.error("Error confirming order:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
