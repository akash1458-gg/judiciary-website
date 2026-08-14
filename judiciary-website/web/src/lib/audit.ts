import { prisma } from "./prisma";

export type AuditInput = {
  userId?: string | null;
  action: string;
  entity?: string;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Write an audit log entry.
 * Safe to call even if DB is not ready – fails silently in demo.
 */
export async function writeAuditLog(input: AuditInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId || null,
        action: input.action,
        entity: input.entity || null,
        entityId: input.entityId || null,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });
  } catch (err) {
    // Demo: don't crash the request if DB is offline
    console.warn("[audit] failed to write log:", err);
  }
}

/** Convenience actions */
export const AuditActions = {
  LOGIN: "USER_LOGIN",
  LOGOUT: "USER_LOGOUT",
  FILING_SUBMIT: "FILING_SUBMIT",
  FILING_ACCEPT: "FILING_ACCEPT",
  FILING_RETURN: "FILING_RETURN",
  ORDER_UPLOAD: "ORDER_UPLOAD",
  CAUSE_LIST_PUBLISH: "CAUSE_LIST_PUBLISH",
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  FILE_UPLOAD: "FILE_UPLOAD",
  PAYMENT: "PAYMENT",
  ADMIN_ACCESS: "ADMIN_ACCESS",
} as const;
