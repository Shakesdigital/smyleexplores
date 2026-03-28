import { NextResponse } from "next/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  if (!body.name || !body.email || !body.phone || !body.travelDate || !body.guests) {
    return NextResponse.json({ error: "Please complete the required quote fields." }, { status: 400 });
  }

  const client = createSupabaseServiceRoleClient();
  if (client) {
    const { error } = await client.from("quote_requests").insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      travel_date: body.travelDate,
      guests: body.guests,
      preferred_tour: body.tour || null,
      special_requests: body.specialRequests || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "Quote request saved successfully. We'll respond within 24 hours with a personalized quote." });
}
