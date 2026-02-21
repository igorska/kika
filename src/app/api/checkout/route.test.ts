import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Hoist mock functions so they're available inside vi.mock factories ---
const mockSessionCreate = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  // Must use `function` (not arrow) so it can be called with `new`
  default: vi.fn(function () {
    return { checkout: { sessions: { create: mockSessionCreate } } };
  }),
}));

import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(
  body: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request("http://localhost/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = { name: "Anna", email: "anna@example.com" };

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  process.env.STRIPE_PRICE_ID = "price_test123";
  process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  mockSessionCreate.mockResolvedValue({
    url: "https://checkout.stripe.com/test-session",
  });
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("validation", () => {
  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "anna@example.com" }) as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Name and email are required" });
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ name: "Anna" }) as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Name and email are required" });
  });

  it("returns 400 when body is empty", async () => {
    const res = await POST(makeRequest({}) as any);
    expect(res.status).toBe(400);
  });

  it("does not call Stripe when validation fails", async () => {
    await POST(makeRequest({ email: "anna@example.com" }) as any);
    expect(mockSessionCreate).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Stripe session creation
// ---------------------------------------------------------------------------

describe("stripe session creation", () => {
  it("returns 200 with the session url on success", async () => {
    const res = await POST(makeRequest(VALID_BODY) as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      url: "https://checkout.stripe.com/test-session",
    });
  });

  it("creates session with payment mode and correct price", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_test123", quantity: 1 }],
        customer_email: "anna@example.com",
      }),
    );
  });

  it("sets success and cancel URLs from NEXT_PUBLIC_BASE_URL", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url:
          "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/",
      }),
    );
  });

  it("stores customer name and email in metadata", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          customer_name: "Anna",
          customer_email: "anna@example.com",
        }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// IP extraction
// ---------------------------------------------------------------------------

describe("IP extraction", () => {
  it("reads IP from x-forwarded-for", async () => {
    await POST(
      makeRequest(VALID_BODY, { "x-forwarded-for": "1.2.3.4" }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_ip: "1.2.3.4" }),
      }),
    );
  });

  it("uses the first IP when x-forwarded-for contains a chain", async () => {
    await POST(
      makeRequest(VALID_BODY, {
        "x-forwarded-for": "1.2.3.4, 10.0.0.1, 172.16.0.1",
      }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_ip: "1.2.3.4" }),
      }),
    );
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", async () => {
    await POST(
      makeRequest(VALID_BODY, { "x-real-ip": "9.9.9.9" }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_ip: "9.9.9.9" }),
      }),
    );
  });

  it("stores — when no IP header is present", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_ip: "—" }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Geo extraction
// ---------------------------------------------------------------------------

describe("geo extraction", () => {
  it("reads country from x-vercel-ip-country", async () => {
    await POST(
      makeRequest(VALID_BODY, { "x-vercel-ip-country": "RU" }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_country: "RU" }),
      }),
    );
  });

  it("falls back to cf-ipcountry when vercel header is absent", async () => {
    await POST(
      makeRequest(VALID_BODY, { "cf-ipcountry": "DE" }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_country: "DE" }),
      }),
    );
  });

  it("stores — for country when no geo header is present", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_country: "—" }),
      }),
    );
  });

  it("decodes percent-encoded city names", async () => {
    await POST(
      makeRequest(VALID_BODY, {
        "x-vercel-ip-city": "Saint%20Petersburg",
      }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_city: "Saint Petersburg" }),
      }),
    );
  });

  it("reads accept-language first tag as lang", async () => {
    await POST(
      makeRequest(VALID_BODY, {
        "accept-language": "ru-RU,ru;q=0.9,en;q=0.8",
      }) as any,
    );
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_lang: "ru-RU" }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// User-agent handling
// ---------------------------------------------------------------------------

describe("user-agent handling", () => {
  it("truncates user-agent to 500 characters", async () => {
    const longUA = "Mozilla/5.0 " + "x".repeat(600);
    await POST(makeRequest(VALID_BODY, { "user-agent": longUA }) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          customer_ua: longUA.slice(0, 500),
        }),
      }),
    );
  });

  it("stores — when user-agent header is absent", async () => {
    await POST(makeRequest(VALID_BODY) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_ua: "—" }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Device detection (parseDevice — tested via metadata output)
// ---------------------------------------------------------------------------

describe("device detection", () => {
  const cases: [string, string, string][] = [
    [
      "Chrome on macOS",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Chrome / macOS",
    ],
    [
      "Firefox on Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
      "Firefox / Windows",
    ],
    [
      "Safari on iPhone",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Safari / iPhone",
    ],
    [
      "Edge on Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
      "Edge / Windows",
    ],
    [
      "Chrome on Android",
      "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      "Chrome / Android",
    ],
    [
      "Safari on iPad",
      "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
      "Safari / iPad",
    ],
    [
      "Opera on Windows",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0",
      "Opera / Windows",
    ],
  ];

  it.each(cases)("detects %s", async (_label, ua, expected) => {
    await POST(makeRequest(VALID_BODY, { "user-agent": ua }) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_device: expected }),
      }),
    );
  });

  it("returns — / — for empty user-agent string", async () => {
    await POST(makeRequest(VALID_BODY, { "user-agent": "" }) as any);
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ customer_device: "—" }),
      }),
    );
  });
});
