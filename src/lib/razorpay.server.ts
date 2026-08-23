import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RAZORPAY_KEY_ID = process.env["RAZORPAY_KEY_ID"];
const RAZORPAY_KEY_SECRET = process.env["RAZORPAY_KEY_SECRET"];

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.warn("[Razorpay] Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables.");
}

const basicAuth = () => {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured");
  }
  return `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`;
};

const CreateOrderSchema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
});

type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
type CreateOrderOutput = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator(CreateOrderSchema)
  .handler(async (ctx): Promise<CreateOrderOutput> => {
    const { amount, currency, receipt } = ctx.data;

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: basicAuth(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: currency ?? "INR",
        receipt: receipt ?? `receipt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[Razorpay] Order creation failed:", response.status, text);
      throw new Error(`Razorpay order creation failed: ${response.status}`);
    }

    const order = (await response.json()) as CreateOrderOutput;
    return order;
  });

const VerifyPaymentSchema = z.object({
  order_id: z.string(),
  payment_id: z.string(),
  signature: z.string(),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
export type VerifyPaymentOutput = { valid: boolean };

async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .validator(VerifyPaymentSchema)
  .handler(async (ctx): Promise<VerifyPaymentOutput> => {
    const { order_id, payment_id, signature } = ctx.data;

    if (!RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay credentials are not configured");
    }

    const payload = `${order_id}|${payment_id}`;
    const expectedSignature = await hmacSha256(payload, RAZORPAY_KEY_SECRET);

    return {
      valid: expectedSignature === signature,
    };
  });
