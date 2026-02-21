import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Hoist mock functions so they're available inside vi.mock factories ---
const mockConstructEvent = vi.hoisted(() => vi.fn());
const mockEmailSend = vi.hoisted(() => vi.fn());
const mockReadFileSync = vi.hoisted(() => vi.fn());

vi.mock("stripe", () => ({
  // Must use `function` (not arrow) so it can be called with `new`
  default: vi.fn(function () {
    return { webhooks: { constructEvent: mockConstructEvent } };
  }),
}));

vi.mock("resend", () => ({
  // Must use `function` (not arrow) so it can be called with `new`
  Resend: vi.fn(function () {
    return { emails: { send: mockEmailSend } };
  }),
}));

vi.mock("fs", () => ({
  default: { readFileSync: mockReadFileSync },
  readFileSync: mockReadFileSync,
}));

import { POST } from "./route";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FAKE_PDF = Buffer.from("fake-pdf-content");

function makeRequest(body = "stripe-raw-body", signature = "valid-sig"): Request {
  return new Request("http://localhost/api/webhook", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body,
  });
}

function makeSession(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: "cs_test_abc123",
    object: "checkout.session",
    created: 1_700_000_000,
    amount_total: 99_000,
    currency: "rub",
    payment_intent: "pi_test_xyz",
    customer_email: "fallback@example.com",
    metadata: {
      customer_name: "Anna",
      customer_email: "anna@example.com",
      customer_ip: "1.2.3.4",
      customer_country: "RU",
      customer_city: "Moscow",
      customer_region: "MOW",
      customer_device: "Chrome / macOS",
      customer_lang: "ru-RU",
      customer_ua: "Mozilla/5.0 (test)",
    },
    ...overrides,
  };
}

function makeEvent(type: string, session: Record<string, unknown>) {
  return { type, data: { object: session } };
}

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = "sk_test_dummy";
  process.env.RESEND_API_KEY = "re_dummy";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  process.env.ADMIN_EMAIL = "kristar@mailinator.com";
  mockReadFileSync.mockReturnValue(FAKE_PDF);
  mockEmailSend.mockResolvedValue({ id: "email_mock_id" });
});

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

describe("signature verification", () => {
  it("returns 400 when signature is invalid", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("No signatures found matching the expected signature");
    });
    const res = await POST(makeRequest("body", "bad-sig") as any);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid signature" });
  });

  it("passes raw text body (not parsed JSON) to constructEvent", async () => {
    mockConstructEvent.mockReturnValue(makeEvent("other.event", {}));
    await POST(makeRequest("my-raw-body", "sig") as any);
    expect(mockConstructEvent).toHaveBeenCalledWith(
      "my-raw-body",
      "sig",
      "whsec_test",
    );
  });

  it("does not send any email when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    await POST(makeRequest() as any);
    expect(mockEmailSend).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Unhandled event types
// ---------------------------------------------------------------------------

describe("unhandled event types", () => {
  it("returns 200 for unrecognised events without sending email", async () => {
    mockConstructEvent.mockReturnValue(makeEvent("payment_intent.created", {}));
    const res = await POST(makeRequest() as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("returns 200 for charge.succeeded without sending email", async () => {
    mockConstructEvent.mockReturnValue(makeEvent("charge.succeeded", {}));
    const res = await POST(makeRequest() as any);
    expect(res.status).toBe(200);
    expect(mockEmailSend).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// checkout.session.completed — happy path
// ---------------------------------------------------------------------------

describe("checkout.session.completed", () => {
  it("reads the PDF from disk", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);
    expect(mockReadFileSync).toHaveBeenCalledWith(
      expect.stringContaining("private/guide.pdf"),
    );
  });

  it("sends customer email with PDF attachment", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const customerCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "anna@example.com",
    );
    expect(customerCall).toBeDefined();
    const [{ attachments }] = customerCall!;
    expect(attachments[0].filename).toBe("guide.pdf");
    expect(attachments[0].content).toBe(FAKE_PDF.toString("base64"));
  });

  it("customer email subject contains the product name", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const customerCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "anna@example.com",
    );
    expect(customerCall![0].subject).toContain("гайд");
  });

  it("customer email body greets the buyer by name", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const customerCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "anna@example.com",
    );
    expect(customerCall![0].html).toContain("Anna");
  });

  it("sends admin notification email as a separate call", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    expect(mockEmailSend).toHaveBeenCalledTimes(2);
    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall).toBeDefined();
  });

  it("admin email subject contains buyer name and formatted amount", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].subject).toContain("Anna");
    expect(adminCall![0].subject).toContain("990.00 RUB");
  });

  it("admin email HTML contains buyer IP and country", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].html).toContain("1.2.3.4");
    expect(adminCall![0].html).toContain("RU");
  });

  it("admin email HTML contains Stripe session and payment-intent IDs", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);

    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].html).toContain("cs_test_abc123");
    expect(adminCall![0].html).toContain("pi_test_xyz");
  });

  it("returns 200 with { received: true } after success", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    const res = await POST(makeRequest() as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
  });
});

// ---------------------------------------------------------------------------
// checkout.session.completed — amount formatting
// ---------------------------------------------------------------------------

describe("amount formatting", () => {
  it("formats cents correctly (99000 → 990.00 RUB)", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    await POST(makeRequest() as any);
    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].subject).toContain("990.00 RUB");
  });

  it("uppercases the currency code", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent(
        "checkout.session.completed",
        makeSession({ amount_total: 149_00, currency: "eur" }),
      ),
    );
    await POST(makeRequest() as any);
    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].subject).toContain("EUR");
    expect(adminCall![0].subject).not.toContain("eur");
  });

  it("shows — when amount_total is null", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent(
        "checkout.session.completed",
        makeSession({ amount_total: null }),
      ),
    );
    await POST(makeRequest() as any);
    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].subject).toContain("—");
  });
});

// ---------------------------------------------------------------------------
// checkout.session.completed — fallbacks
// ---------------------------------------------------------------------------

describe("metadata fallbacks", () => {
  it("falls back to session.customer_email when metadata email is absent", async () => {
    const session = makeSession({
      metadata: { customer_name: "Bob" },
    });
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", session),
    );
    await POST(makeRequest() as any);

    const customerCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "fallback@example.com",
    );
    expect(customerCall).toBeDefined();
  });

  it("uses Покупатель as name when metadata name is absent", async () => {
    const session = makeSession({
      metadata: { customer_email: "anna@example.com" },
    });
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", session),
    );
    await POST(makeRequest() as any);

    const customerCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "anna@example.com",
    );
    expect(customerCall![0].html).toContain("Покупатель");
  });

  it("uses — for missing geo fields in admin email", async () => {
    const session = makeSession({ metadata: { customer_email: "anna@example.com" } });
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", session),
    );
    await POST(makeRequest() as any);

    const adminCall = mockEmailSend.mock.calls.find(
      ([args]) => args.to === "kristar@mailinator.com",
    );
    expect(adminCall![0].html).toContain("—");
  });
});

// ---------------------------------------------------------------------------
// checkout.session.completed — resilience
// ---------------------------------------------------------------------------

describe("resilience", () => {
  it("returns 200 even when resend.emails.send throws", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    mockEmailSend.mockRejectedValue(new Error("Resend API unavailable"));

    const res = await POST(makeRequest() as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
  });

  it("skips all email sending when customer email is completely absent", async () => {
    const session = makeSession({
      metadata: {},
      customer_email: null,
    });
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", session),
    );
    await POST(makeRequest() as any);

    expect(mockEmailSend).not.toHaveBeenCalled();
  });

  it("still returns 200 when PDF file cannot be read", async () => {
    mockConstructEvent.mockReturnValue(
      makeEvent("checkout.session.completed", makeSession()),
    );
    mockReadFileSync.mockImplementation(() => {
      throw new Error("ENOENT: no such file or directory");
    });

    const res = await POST(makeRequest() as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });
  });
});
