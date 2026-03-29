import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { isAdminSessionValid } from "@/lib/admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

const CMS_MEDIA_BUCKET = "cms-media";
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeSegment(value: string, fallback: string) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9/_-]+/g, "-").replace(/\/+/g, "/");
  return normalized.length ? normalized : fallback;
}

async function ensureCmsMediaBucket(client: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>) {
  const { data: bucket, error } = await client.storage.getBucket(CMS_MEDIA_BUCKET);
  if (!error && bucket) return;

  const createResult = await client.storage.createBucket(CMS_MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
  });

  if (createResult.error && !/already exists/i.test(createResult.error.message)) {
    throw new Error(createResult.error.message);
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminSessionValid();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const client = createSupabaseServiceRoleClient();
    if (!client) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is not configured." }, { status: 500 });
    }

    await ensureCmsMediaBucket(client);

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = sanitizeSegment(String(formData.get("folder") ?? "general"), "general");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
    }

    const extension = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() ?? "jpg" : "jpg";
    const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
    const path = `${folder}/${fileName}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error } = await client.storage.from(CMS_MEDIA_BUCKET).upload(path, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = client.storage.from(CMS_MEDIA_BUCKET).getPublicUrl(path);

    return NextResponse.json({
      path,
      url: data.publicUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal upload error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
