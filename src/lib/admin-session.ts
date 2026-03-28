import { createHash } from "node:crypto";

import { cookies } from "next/headers";

const COOKIE_NAME = "cms_admin_session";

function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function hasCmsAdminPassword() {
  return Boolean(process.env.CMS_ADMIN_PASSWORD);
}

export async function isAdminSessionValid() {
  const configuredPassword = process.env.CMS_ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === hashSecret(configuredPassword);
}

export async function createAdminSession() {
  const configuredPassword = process.env.CMS_ADMIN_PASSWORD;
  if (!configuredPassword) {
    throw new Error("CMS_ADMIN_PASSWORD is not configured.");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hashSecret(configuredPassword), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
