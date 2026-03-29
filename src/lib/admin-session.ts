import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

import { cookies } from "next/headers";

import { createSupabaseServiceRoleClient } from "@/lib/supabase";

const COOKIE_NAME = "cms_admin_session";
const DEFAULT_ADMIN_USERNAME = "admin";

type StoredAdminAccount = {
  id: string;
  username: string;
  password_hash: string;
};

type AdminAccessConfig = {
  username: string;
  source: "database" | "environment";
  sessionSecret: string;
  passwordHash?: string;
};

function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function createAdminSessionSecret(username: string, passwordSecret: string) {
  return hashSecret(`${username}:${passwordSecret}`);
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, storedHash: string) {
  const [salt, expectedHash] = storedHash.split(":");
  if (!salt || !expectedHash) return false;

  const providedHash = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (providedHash.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedHash, expectedBuffer);
}

function getEnvironmentAdminConfig(): AdminAccessConfig | null {
  const password = process.env.CMS_ADMIN_PASSWORD;
  if (!password) return null;

  const username = process.env.CMS_ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
  return {
    username,
    source: "environment",
    sessionSecret: createAdminSessionSecret(username, password),
  };
}

export async function getConfiguredAdminAccess() {
  const client = createSupabaseServiceRoleClient();

  if (client) {
    const result = await client
      .from("admin_accounts")
      .select("id,username,password_hash")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const account = result.data as StoredAdminAccount | null;
    if (!result.error && account?.username && account.password_hash) {
      return {
        username: account.username,
        source: "database" as const,
        sessionSecret: createAdminSessionSecret(account.username, account.password_hash),
        passwordHash: account.password_hash,
      };
    }
  }

  return getEnvironmentAdminConfig();
}

export async function hasConfiguredAdminAccess() {
  return Boolean(await getConfiguredAdminAccess());
}

export async function verifyAdminCredentials(username: string, password: string) {
  const config = await getConfiguredAdminAccess();
  if (!config) {
    throw new Error("Admin access is not configured yet.");
  }

  const normalizedUsername = username.trim();
  if (normalizedUsername !== config.username) {
    throw new Error("Incorrect username or password.");
  }

  if (config.source === "database") {
    if (!config.passwordHash || !verifyPasswordHash(password, config.passwordHash)) {
      throw new Error("Incorrect username or password.");
    }
  } else if (password !== process.env.CMS_ADMIN_PASSWORD) {
    throw new Error("Incorrect username or password.");
  }

  return config;
}

export async function isAdminSessionValid() {
  const config = await getConfiguredAdminAccess();
  if (!config) return false;

  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === config.sessionSecret;
}

export async function createAdminSession(sessionSecret: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, sessionSecret, {
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
