import { NextResponse } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  if (!body.name || !body.email || !body.phone || !body.subject || !body.message) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }

  const client = createSupabaseServiceRoleClient();
  if (client) {
    const { error } = await client.from("contact_submissions").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Thanks for contacting Smyle Explores. Your inquiry has been saved and the team will follow up shortly." });
}
