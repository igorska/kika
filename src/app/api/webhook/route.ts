import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import fs from "fs";
import path from "path";
import { APP_CONFIG } from "@/lib/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const err = pi.last_payment_error;
    const customerEmail = pi.receipt_email ?? err?.payment_method?.billing_details?.email ?? "—";
    const customerName  = err?.payment_method?.billing_details?.name ?? "—";
    const amount = `${(pi.amount / 100).toFixed(2)} ${pi.currency.toUpperCase()}`;
    const failedAt = new Date(pi.created * 1000).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });
    const reason = err?.message ?? "—";
    const code = err?.code ?? "—";
    const declineCode = err?.decline_code ?? "—";
    const cardBrand    = err?.payment_method?.card?.brand   ?? "—";
    const cardLast4    = err?.payment_method?.card?.last4   ?? "—";
    const cardCountry  = err?.payment_method?.card?.country ?? "—";

    // Try to get IP-based country from the linked checkout session
    let ipCountry = "—";
    try {
      const sessions = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 });
      const sessionMeta = sessions.data[0]?.metadata ?? {};
      if (sessionMeta.customer_country && sessionMeta.customer_country !== "—") {
        ipCountry = sessionMeta.customer_country;
      }
    } catch { /* not critical */ }

    try {
      await resend.emails.send({
        from: APP_CONFIG.senderEmail,
        to: APP_CONFIG.adminEmail,
        subject: `❌ Неудачный платёж: ${customerName} — ${amount}`,
        html: `
          <div style="font-family:Arial,sans-serif;font-size:14px;max-width:560px">
            <h2 style="margin:0 0 20px;font-size:18px;color:#c0392b">Неудачный платёж</h2>

            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Причина отказа</p>
            <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Сообщение</td><td style="padding:5px 0;color:#c0392b"><strong>${reason}</strong></td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Код ошибки</td><td style="padding:5px 0;font-family:monospace">${code}</td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Код отказа</td><td style="padding:5px 0;font-family:monospace">${declineCode}</td></tr>
            </table>

            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Покупатель</p>
            <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Имя</td><td style="padding:5px 0"><strong>${customerName}</strong></td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Email</td><td style="padding:5px 0"><a href="mailto:${customerEmail}" style="color:#A1245B">${customerEmail}</a></td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Страна (IP)</td><td style="padding:5px 0">${ipCountry}</td></tr>
            </table>

            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Карта</p>
            <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Бренд</td><td style="padding:5px 0">${cardBrand}</td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Последние 4 цифры</td><td style="padding:5px 0;font-family:monospace">•••• ${cardLast4}</td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Страна карты</td><td style="padding:5px 0">${cardCountry}</td></tr>
            </table>

            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Платёж</p>
            <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Сумма</td><td style="padding:5px 0">${amount}</td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Дата попытки</td><td style="padding:5px 0">${failedAt} МСК</td></tr>
              <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Payment Intent</td><td style="padding:5px 0;font-family:monospace;font-size:11px;color:#888">${pi.id}</td></tr>
            </table>
          </div>
        `,
      });
    } catch (err) {
      console.error("Failed to send failed-payment notification:", err);
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata ?? {};
    const customerName = m.customer_name ?? "Покупатель";
    const customerEmail = m.customer_email ?? session.customer_email ?? "";
    const amountTotal = session.amount_total != null
      ? `${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase()}`
      : "—";
    const paidAt = new Date(session.created * 1000).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

    const ip       = m.customer_ip       ?? "—";
    const country  = m.customer_country  ?? "—";
    const city     = m.customer_city     ?? "—";
    const region   = m.customer_region   ?? "—";
    const device   = m.customer_device   ?? "—";
    const lang     = m.customer_lang     ?? "—";
    const ua       = m.customer_ua       ?? "—";
    const location = [city, region, country].filter(v => v && v !== "—").join(", ") || "—";

    if (customerEmail) {
      try {
        const pdfBuffer = fs.readFileSync(path.join(process.cwd(), APP_CONFIG.pdfPath));
        const pdfBase64 = pdfBuffer.toString("base64");

        // Email to customer — clean, just the guide
        await resend.emails.send({
          from: APP_CONFIG.senderEmail,
          to: customerEmail,
          subject: `Ваш гайд: ${APP_CONFIG.productName}`,
          html: `
            <p>Привет, ${customerName}!</p>
            <p>Спасибо за покупку. Ваш гайд прикреплён к этому письму.</p>
            <p>Если у вас есть вопросы, просто ответьте на это письмо.</p>
          `,
          attachments: [{ filename: "guide.pdf", content: pdfBase64 }],
        });

        // Separate notification to admin with full purchase details
        await resend.emails.send({
          from: APP_CONFIG.senderEmail,
          to: APP_CONFIG.adminEmail,
          subject: `Новая покупка: ${customerName} — ${amountTotal}`,
          html: `
            <div style="font-family:Arial,sans-serif;font-size:14px;max-width:560px">
              <h2 style="margin:0 0 20px;font-size:18px">Новая покупка гайда</h2>

              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Покупатель</p>
              <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Имя</td><td style="padding:5px 0"><strong>${customerName}</strong></td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Email</td><td style="padding:5px 0"><a href="mailto:${customerEmail}" style="color:#A1245B">${customerEmail}</a></td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Язык браузера</td><td style="padding:5px 0">${lang}</td></tr>
              </table>

              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Местонахождение</p>
              <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">IP-адрес</td><td style="padding:5px 0;font-family:monospace">${ip}</td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Страна</td><td style="padding:5px 0">${country}</td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Город / Регион</td><td style="padding:5px 0">${location}</td></tr>
              </table>

              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Устройство</p>
              <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Браузер / ОС</td><td style="padding:5px 0">${device}</td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">User-Agent</td><td style="padding:5px 0;font-size:11px;color:#888;word-break:break-all">${ua}</td></tr>
              </table>

              <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;color:#999;letter-spacing:.06em">Платёж</p>
              <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Сумма</td><td style="padding:5px 0"><strong>${amountTotal}</strong></td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Дата оплаты</td><td style="padding:5px 0">${paidAt} МСК</td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Session ID</td><td style="padding:5px 0;font-family:monospace;font-size:11px;color:#888">${session.id}</td></tr>
                <tr><td style="padding:5px 16px 5px 0;color:#666;white-space:nowrap">Payment Intent</td><td style="padding:5px 0;font-family:monospace;font-size:11px;color:#888">${session.payment_intent ?? "—"}</td></tr>
              </table>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send guide email:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
