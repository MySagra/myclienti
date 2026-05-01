import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { CreateOrderSchema } from "@/schemas/order";

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
      body: JSON.stringify(validationResult.data),
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