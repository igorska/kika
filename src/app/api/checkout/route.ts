import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function parseDevice(ua: string): string {
  if (!ua || ua === "—") return "—";
  let browser = "Unknown";
  let os = "Unknown";

  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/.test(ua)) browser = "Opera";
  else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = "Chrome";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = "Safari";

  if (/iPhone/.test(ua)) os = "iPhone";
  else if (/iPad/.test(ua)) os = "iPad";
  else if (/Android/.test(ua)) os = "Android";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Macintosh/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return `${browser} / ${os}`;
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json();
  const { name, email } = body as { name?: string; email?: string };

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  // Collect request context
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") ?? "—");
  const country = request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry") ?? "—";
  const city = decodeURIComponent(request.headers.get("x-vercel-ip-city") ?? "—");
  const region = request.headers.get("x-vercel-ip-country-region") ?? "—";
  const ua = request.headers.get("user-agent") ?? "—";
  const lang = request.headers.get("accept-language")?.split(",")[0] ?? "—";
  const device = parseDevice(ua);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    customer_email: email,
    metadata: {
      customer_name: name,
      customer_email: email,
      customer_ip: ip,
      customer_country: country,
      customer_city: city,
      customer_region: region,
      customer_device: device,
      customer_lang: lang,
      customer_ua: ua.slice(0, 500),
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
  });

  return NextResponse.json({ url: session.url });
}
