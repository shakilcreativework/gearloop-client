import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;
const EXPRESS_URL = process.env.NEXT_PUBLIC_API_URL!;

interface PaddleWebhookEvent {
  event_id: string;
  event_type: string;
  data: {
    id: string;
    custom_data?: Record<string, unknown>;
    status?: string;
    [key: string]: unknown;
  };
}

function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string,
): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false;

  const parts = signatureHeader.split(";");
  const sigMap: Record<string, string> = {};
  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k && v) sigMap[k.trim()] = v.trim();
  }

  const ts = sigMap["ts"];
  const v1 = sigMap["v1"];
  if (!ts || !v1) return false;

  const signedPayload = `${ts}.${rawBody}`;
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("base64");

  try {
    return timingSafeEqual(Buffer.from(v1), Buffer.from(expected));
  } catch {
    return false;
  }
}

async function updateBookingViaExpress(
  bookingId: string,
  body: { paymentStatus?: string; status?: string },
): Promise<void> {
  const res = await fetch(`${EXPRESS_URL}/api/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Key": INTERNAL_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Express PATCH /api/bookings/${bookingId}/status returned ${res.status}: ${text}`,
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature") ?? "";

    if (!verifyPaddleSignature(rawBody, signatureHeader)) {
      console.error("[Paddle Webhook] Signature verification failed");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    const event = JSON.parse(rawBody) as PaddleWebhookEvent;

    if (event.event_type === "transaction.completed") {
      const bookingId = event.data.custom_data?.bookingId as
        | string
        | undefined;

      if (!bookingId) {
        console.error(
          "[Paddle Webhook] transaction.completed missing bookingId in custom_data",
        );
        return NextResponse.json({ received: true });
      }

      await updateBookingViaExpress(bookingId, {
        paymentStatus: "paid",
        status: "confirmed",
      });

      console.log(
        `[Paddle Webhook] Booking ${bookingId} marked as paid/confirmed`,
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Paddle Webhook] Processing error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
