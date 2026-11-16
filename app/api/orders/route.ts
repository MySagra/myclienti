import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CreateOrderSchema } from "@/schemas/order";
import { getSettings } from "@/services/settings.service";
import { getOrderingStatus } from "@/lib/ordering";
import { NO_TABLE, tableValueSchema } from "@/lib/table";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = CreateOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Block orders when ordering is CLOSED or outside the SCHEDULE window
    const settings = await getSettings();
    const orderingStatus = getOrderingStatus(settings);
    if (!orderingStatus.canSend) {
      return NextResponse.json(
        { error: "Ordering is not available", code: "ORDERING_CLOSED", status: orderingStatus },
        { status: 403 }
      );
    }

    // Table rules from settings: HIDDEN -> placeholder, otherwise validate type and maxTables
    const order = { ...validationResult.data };
    if (!settings.table.enabled) {
      order.table = NO_TABLE;
    } else {
      const tableResult = tableValueSchema(settings.table).safeParse(order.table);
      if (!tableResult.success) {
        return NextResponse.json(
          { error: tableResult.error.issues[0]?.message ?? "Invalid table", code: "INVALID_TABLE" },
          { status: 400 }
        );
      }
      order.table = tableResult.data;
    }

    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { error: "API URL not configured" },
        { status: 500 }
      );
    }

    // Estrae l'IP reale del client e lo propaga al backend
    // così il rate limiter vede l'IP del client e non quello del server Next.js
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const response = await fetch(`${apiUrl}/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": clientIp,
        "X-API-KEY": process.env.CLIENTI_API_KEY ?? '',
      },
      body: JSON.stringify(order),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status >= 500) {
        revalidatePath("/");
        revalidatePath("/menu");
        revalidatePath("/confirmation");
      }
      return NextResponse.json(
        { error: data.message || "Failed to create order", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}