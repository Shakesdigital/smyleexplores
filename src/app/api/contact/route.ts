import { NextResponse } from "next/server";

import { hasSupabase, supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  if (!body.name || !body.email || !body.phone || !body.subject || !body.message) {
    return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
  }
  if (hasSupabase && supabase) {
    await supabase.from("contact_submissions").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
    });
  }
  return NextResponse.json({ message: "Thanks for contacting Smyle Explores. Your message has been received." });
}
