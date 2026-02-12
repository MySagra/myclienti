import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const apiUrl = process.env.MYSAGRA_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL not configured" },
      { status: 500 }
    );
  }

  const uploadPath = path.join("/");
  const targetUrl = `${apiUrl}/uploads/${uploadPath}`;

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 502 }
    );
  }
}
