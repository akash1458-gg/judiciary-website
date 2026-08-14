/**
 * Payment gateway stub (Razorpay / Stripe style).
 * Demo: creates a mock payment intent and marks success.
 * Production: call real gateway APIs and verify webhooks.
 */

import { writeAuditLog, AuditActions } from "./audit";

export type PaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  purpose: string;
  status: "created" | "pending" | "success" | "failed";
  gatewayRef: string;
  checkoutUrl?: string;
};

export type CreatePaymentInput = {
  userId: string;
  amount: number;
  currency?: string;
  purpose: string;
  metadata?: Record<string, string>;
};

export async function createPaymentIntent(
  input: CreatePaymentInput
): Promise<PaymentIntent> {
  const id = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const gatewayRef = `mock_gw_${id}`;

  const intent: PaymentIntent = {
    id,
    amount: input.amount,
    currency: input.currency || "INR",
    purpose: input.purpose,
    status: "created",
    gatewayRef,
    checkoutUrl: `/api/payments/checkout?id=${id}`, // demo redirect
  };

  await writeAuditLog({
    userId: input.userId,
    action: AuditActions.PAYMENT,
    entity: "Payment",
    entityId: id,
    metadata: {
      amount: input.amount,
      purpose: input.purpose,
      status: "created",
    },
  });

  return intent;
}

/** Simulate successful payment (e.g. after gateway callback) */
export async function confirmPayment(
  paymentId: string,
  userId?: string
): Promise<{ success: boolean; receiptUrl: string }> {
  await writeAuditLog({
    userId,
    action: AuditActions.PAYMENT,
    entity: "Payment",
    entityId: paymentId,
    metadata: { status: "success" },
  });

  return {
    success: true,
    receiptUrl: `/receipts/${paymentId}.pdf`,
  };
}

/** Fee calculation helper for e-filing */
export function calculateCourtFees(caseType: string): {
  courtFee: number;
  processFee: number;
  misc: number;
  total: number;
} {
  const base: Record<string, number> = {
    "Civil Suit": 500,
    "Criminal Case": 300,
    "Writ Petition": 1000,
    "Bail Application": 200,
    Appeal: 750,
    Revision: 400,
  };
  const courtFee = base[caseType] ?? 500;
  const processFee = 100;
  const misc = 50;
  return {
    courtFee,
    processFee,
    misc,
    total: courtFee + processFee + misc,
  };
}
