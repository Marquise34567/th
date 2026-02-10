import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Proxy /api/generate requests to the local backend.
 * Uses NEXT_PUBLIC_API_BASE_URL or falls back to http://localhost:8787
 */
export async function POST(request: Request) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8787";
  const target = `${apiBase.replace(/\/$/, "")}/generate`;

  // Forward headers and body
  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const body = await request.arrayBuffer();

  const res = await fetch(target, {
    method: "POST",
    headers,
    body: Buffer.from(body),
    redirect: "manual",
  });

  const responseBody = await res.arrayBuffer();
  const respHeaders: Record<string, string> = {};
  const ct = res.headers.get("content-type");
  if (ct) respHeaders["content-type"] = ct;

  return new NextResponse(Buffer.from(responseBody), { status: res.status, headers: respHeaders });
}
