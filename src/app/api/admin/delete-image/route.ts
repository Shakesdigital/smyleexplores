import { NextResponse } from "next/server";

import { isAdminSessionValid } from "@/lib/admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

const CMS_MEDIA_BUCKET = "cms-media";

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

    const body = (await request.json()) as { path?: string };
    const path = String(body.path ?? "").trim();

    if (!path) {
      return NextResponse.json({ error: "No storage path provided." }, { status: 400 });
    }

    const { error } = await client.storage.from(CMS_MEDIA_BUCKET).remove([path]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal delete error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
