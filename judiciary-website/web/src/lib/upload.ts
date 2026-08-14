/**
 * File upload helpers.
 * Demo: stores metadata + simulated URL.
 * Production: upload to S3 / R2 / MinIO and scan for viruses.
 */

import { writeAuditLog, AuditActions } from "./audit";

export type UploadResult = {
  success: boolean;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  error?: string;
};

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export function validateFile(file: {
  name: string;
  type: string;
  size: number;
}): string | null {
  if (!ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Only PDF, JPG and PNG files are allowed.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "File exceeds maximum size of 15 MB.";
  }
  return null;
}

/**
 * Simulate upload. In production replace body with real storage SDK.
 */
export async function uploadFile(
  file: { name: string; type: string; size: number },
  opts?: { userId?: string; folder?: string }
): Promise<UploadResult> {
  const err = validateFile(file);
  if (err) {
    return {
      success: false,
      fileName: file.name,
      fileUrl: "",
      fileSize: file.size,
      fileType: file.type,
      error: err,
    };
  }

  // Simulated object storage key
  const key = `${opts?.folder || "filings"}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const fileUrl = `/uploads/${key}`; // would be https://cdn.example.com/...

  await writeAuditLog({
    userId: opts?.userId,
    action: AuditActions.FILE_UPLOAD,
    entity: "Document",
    metadata: { fileName: file.name, size: file.size, key },
  });

  return {
    success: true,
    fileName: file.name,
    fileUrl,
    fileSize: file.size,
    fileType: file.type,
  };
}
