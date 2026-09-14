import { NextRequest, NextResponse } from "next/server";

// Server-side proxy so the Ivy Homes API key never reaches the browser bundle.
// The key lives only in process.env.IVY_API_KEY (set in .env.local, gitignored,
// and as a Vercel project env var in production).

const API_BASE = process.env.IVY_API_BASE || "https://solve.ivy.homes";
const API_KEY = process.env.IVY_API_KEY;

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path.join("/");
  const incomingUrl = new URL(req.url);
  const upstreamUrl = new URL(`${API_BASE}/${path}`);

  incomingUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  if (!API_KEY) {
    return NextResponse.json(
      {
        detail:
          "IVY_API_KEY is not set on the server. Add it to .env.local (or your Vercel env vars) and restart.",
      },
      { status: 500 },
    );
  }

  // The API rejects the key as a query parameter — it must be an X-API-Key header.
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  };
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  let body: string | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await req.text();
    } catch {
      body = undefined;
    }
  }

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      cache: "no-store",
    });

    const contentType = upstreamRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await upstreamRes.json().catch(() => ({}));
      return NextResponse.json(data, { status: upstreamRes.status });
    }
    const text = await upstreamRes.text();
    return new NextResponse(text, { status: upstreamRes.status });
  } catch {
    return NextResponse.json(
      { detail: "Could not reach the Ivy Homes API. Please try again." },
      { status: 502 },
    );
  }
}

export {
  handler as GET,
  handler as POST,
  handler as DELETE,
  handler as PUT,
  handler as PATCH,
};
