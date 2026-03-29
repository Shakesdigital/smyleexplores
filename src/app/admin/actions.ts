"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { clearAdminSession, createAdminSession, isAdminSessionValid } from "@/lib/admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalValue(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

function redirectWithMessage(type: "success" | "error", message: string) {
  redirect(`/admin?${type}=${encodeMessage(message)}`);
}

function redirectWithTourMessage(type: "success" | "error", message: string, slug?: string) {
  const params = new URLSearchParams();
  params.set(type, message);
  params.set("tab", "tours");
  if (slug) params.set("tour", slug);
  redirect(`/admin?${params.toString()}`);
}

function parseJsonField(value: FormDataEntryValue | null, fieldName: string) {
  try {
    return JSON.parse(String(value ?? "{}"));
  } catch {
    throw new Error(`Invalid JSON in ${fieldName}.`);
  }
}

function collectLinesByPrefix(formData: FormData, prefix: string) {
  const entries = Array.from(formData.entries())
    .filter(([key, value]) => key.startsWith(prefix) && String(value).trim().length > 0)
    .sort(([left], [right]) => left.localeCompare(right));

  return entries.map(([, value]) => String(value).trim());
}

function collectTourHeroSlides(formData: FormData) {
  const indexes = new Set<number>();

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("slideTitle_") || !String(value).trim()) continue;
    indexes.add(Number(key.replace("slideTitle_", "")));
  }

  return [...indexes]
    .sort((left, right) => left - right)
    .map((index) => ({
      image: String(formData.get(`slideImage_${index}`) ?? "").trim(),
      title: String(formData.get(`slideTitle_${index}`) ?? "").trim(),
      subtitle: String(formData.get(`slideSubtitle_${index}`) ?? "").trim(),
    }))
    .filter((slide) => slide.image && slide.title);
}

function collectPageHeroSlides(formData: FormData) {
  const indexes = new Set<number>();

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("heroSlideTitle_") || !String(value).trim()) continue;
    indexes.add(Number(key.replace("heroSlideTitle_", "")));
  }

  return [...indexes]
    .sort((left, right) => left - right)
    .map((index) => ({
      image: String(formData.get(`heroSlideImage_${index}`) ?? "").trim(),
      title: String(formData.get(`heroSlideTitle_${index}`) ?? "").trim(),
      subtitle: String(formData.get(`heroSlideSubtitle_${index}`) ?? "").trim(),
    }))
    .filter((slide) => slide.image && slide.title);
}

function collectTourItineraryDays(formData: FormData) {
  const indexes = new Set<number>();

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("dayTitle_") || !String(value).trim()) continue;
    indexes.add(Number(key.replace("dayTitle_", "")));
  }

  return [...indexes]
    .sort((left, right) => left - right)
    .map((index) => ({
      dayLabel: String(formData.get(`dayLabel_${index}`) ?? "").trim(),
      title: String(formData.get(`dayTitle_${index}`) ?? "").trim(),
      description: String(formData.get(`dayDescription_${index}`) ?? "").trim(),
      activities: parseLines(formData.get(`dayActivities_${index}`)),
      image: String(formData.get(`dayImage_${index}`) ?? "").trim(),
    }))
    .filter((day) => day.dayLabel && day.title);
}

function buildPageContent(formData: FormData, slug: string) {
  if (formData.has("content")) {
    return parseJsonField(formData.get("content"), "page content");
  }

  switch (slug) {
    case "home":
      return {
        heroImage: String(formData.get("heroImage") ?? ""),
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
        heroSlides: collectPageHeroSlides(formData),
        introEyebrow: String(formData.get("introEyebrow") ?? ""),
        introTitle: String(formData.get("introTitle") ?? ""),
        introParagraphs: collectLinesByPrefix(formData, "introParagraph_"),
        featureImage: String(formData.get("featureImage") ?? ""),
        whyEyebrow: String(formData.get("whyEyebrow") ?? ""),
        whyTitle: String(formData.get("whyTitle") ?? ""),
        whyDescription: String(formData.get("whyDescription") ?? ""),
        whyChooseUsItems: [1, 2, 3]
          .map((index) => ({
            title: String(formData.get(`whyItemTitle_${index}`) ?? "").trim(),
            description: String(formData.get(`whyItemDescription_${index}`) ?? "").trim(),
            icon: String(formData.get(`whyItemIcon_${index}`) ?? "").trim(),
          }))
          .filter((item) => item.title && item.description),
        toursEyebrow: String(formData.get("toursEyebrow") ?? ""),
        toursTitle: String(formData.get("toursTitle") ?? ""),
        toursDescription: String(formData.get("toursDescription") ?? ""),
        quoteImage: String(formData.get("quoteImage") ?? ""),
        quoteText: String(formData.get("quoteText") ?? ""),
        testimonialsEyebrow: String(formData.get("testimonialsEyebrow") ?? ""),
        testimonialsTitle: String(formData.get("testimonialsTitle") ?? ""),
        testimonialsDescription: String(formData.get("testimonialsDescription") ?? ""),
        ctaEyebrow: String(formData.get("ctaEyebrow") ?? ""),
        ctaTitle: String(formData.get("ctaTitle") ?? ""),
        ctaDescription: String(formData.get("ctaDescription") ?? ""),
      };
    case "about":
      return {
        heroImage: String(formData.get("heroImage") ?? ""),
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
        heroSlides: collectPageHeroSlides(formData),
        storyEyebrow: String(formData.get("storyEyebrow") ?? ""),
        storyTitle: String(formData.get("storyTitle") ?? ""),
        storyImage: String(formData.get("storyImage") ?? ""),
        storyParagraphs: collectLinesByPrefix(formData, "storyParagraph_"),
        missionEyebrow: String(formData.get("missionEyebrow") ?? ""),
        missionQuote: String(formData.get("missionQuote") ?? ""),
        valuesEyebrow: String(formData.get("valuesEyebrow") ?? ""),
        valuesTitle: String(formData.get("valuesTitle") ?? ""),
        ctaTitle: String(formData.get("ctaTitle") ?? ""),
      };
    case "tours":
      return {
        heroImage: String(formData.get("heroImage") ?? ""),
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
        heroSlides: collectPageHeroSlides(formData),
        introEyebrow: String(formData.get("introEyebrow") ?? ""),
        introTitle: String(formData.get("introTitle") ?? ""),
        introDescription: String(formData.get("introDescription") ?? ""),
      };
    case "blog":
      return {
        heroImage: String(formData.get("heroImage") ?? ""),
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
        heroSlides: collectPageHeroSlides(formData),
        introEyebrow: String(formData.get("introEyebrow") ?? ""),
        introTitle: String(formData.get("introTitle") ?? ""),
        introDescription: String(formData.get("introDescription") ?? ""),
      };
    case "contact":
      return {
        heroImage: String(formData.get("heroImage") ?? ""),
        heroTitle: String(formData.get("heroTitle") ?? ""),
        heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
        heroSlides: collectPageHeroSlides(formData),
        introEyebrow: String(formData.get("introEyebrow") ?? ""),
        introTitle: String(formData.get("introTitle") ?? ""),
        quoteEyebrow: String(formData.get("quoteEyebrow") ?? ""),
        quoteTitle: String(formData.get("quoteTitle") ?? ""),
      };
    default:
      return {};
  }
}

async function requireAdminSession() {
  const valid = await isAdminSessionValid();
  if (!valid) {
    throw new Error("Admin session is not valid.");
  }
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/blog");
  revalidatePath("/contact");
  revalidatePath("/tours");
  revalidatePath("/admin");
}

const OPTIONAL_TOUR_COLUMNS = new Set([
  "destination",
  "hero_slides",
  "itinerary_days",
  "booking_title",
  "booking_description",
  "related_tour_slugs",
]);

function extractMissingColumn(errorMessage: string) {
  const match = errorMessage.match(/Could not find the '([^']+)' column/i);
  return match?.[1] ?? null;
}

async function upsertTourWithSchemaFallback(
  client: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>,
  payload: Record<string, unknown>,
) {
  const skippedColumns: string[] = [];
  const workingPayload = { ...payload };

  while (true) {
    const result = await client.from("tours").upsert(workingPayload, { onConflict: "slug" });
    if (!result.error) {
      return { skippedColumns };
    }

    const missingColumn = extractMissingColumn(result.error.message);
    if (!missingColumn || !OPTIONAL_TOUR_COLUMNS.has(missingColumn) || !(missingColumn in workingPayload)) {
      throw new Error(result.error.message);
    }

    delete workingPayload[missingColumn];
    skippedColumns.push(missingColumn);
  }
}

export async function loginAdminAction(formData: FormData) {
  try {
    const password = String(formData.get("password") ?? "");
    if (!process.env.CMS_ADMIN_PASSWORD) {
      throw new Error("CMS_ADMIN_PASSWORD is not configured.");
    }

    if (password !== process.env.CMS_ADMIN_PASSWORD) {
      throw new Error("Incorrect admin password.");
    }

    await createAdminSession();
    redirect("/admin?success=Signed%20in%20successfully.");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Sign-in failed.";
    redirect(`/admin/login?error=${encodeMessage(message)}`);
  }
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function upsertSettingAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const groupKey = String(formData.get("group_key") ?? "");
    const key = String(formData.get("key") ?? "");
    const valueType = String(formData.get("value_type") ?? "string");
    const isPublic = String(formData.get("is_public") ?? "true") === "true";

    let value: unknown = String(formData.get("value") ?? "");
    if (valueType === "array") {
      value = parseLines(formData.get("value"));
    }

    const { error } = await client.from("settings").upsert(
      {
        group_key: groupKey,
        key,
        value,
        is_public: isPublic,
      },
      { onConflict: "key" },
    );

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved setting ${key}.`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save setting.";
    redirectWithMessage("error", message);
  }
}

export async function upsertPageAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const slug = String(formData.get("slug") ?? "");

    const { error } = await client.from("pages").upsert(
      {
        slug,
        title: String(formData.get("title") ?? ""),
        excerpt: optionalValue(formData.get("excerpt")),
        status: String(formData.get("status") ?? "draft"),
        content: buildPageContent(formData, slug),
        featured_image_url: optionalValue(formData.get("featured_image_url")),
        meta_title: optionalValue(formData.get("meta_title")),
        meta_description: optionalValue(formData.get("meta_description")),
        meta_image_url: optionalValue(formData.get("meta_image_url")),
        published_at: optionalValue(formData.get("published_at")),
      },
      { onConflict: "slug" },
    );

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved page ${slug}.`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save page.";
    redirectWithMessage("error", message);
  }
}

export async function upsertTestimonialAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const id = optionalValue(formData.get("id"));
    const payload = {
      name: String(formData.get("name") ?? ""),
      title: optionalValue(formData.get("title")),
      quote: String(formData.get("quote") ?? ""),
      order_column: Number(String(formData.get("order_column") ?? "0")) || 0,
    };

    const query = id ? client.from("testimonials").update(payload).eq("id", id) : client.from("testimonials").insert(payload);
    const { error } = await query;
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin");
    redirectWithMessage("success", `Saved testimonial for ${payload.name}.`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save testimonial.";
    redirectWithMessage("error", message);
  }
}

export async function upsertCompanyValueAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const id = optionalValue(formData.get("id"));
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: optionalValue(formData.get("description")),
      icon: optionalValue(formData.get("icon")),
      order_column: Number(String(formData.get("order_column") ?? "0")) || 0,
    };

    const query = id ? client.from("company_values").update(payload).eq("id", id) : client.from("company_values").insert(payload);
    const { error } = await query;
    if (error) throw new Error(error.message);

    revalidatePath("/about");
    revalidatePath("/admin");
    redirectWithMessage("success", `Saved value ${payload.title}.`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save company value.";
    redirectWithMessage("error", message);
  }
}

export async function upsertTourAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const slug = String(formData.get("slug") ?? "");
    const payload = {
      slug,
      title: String(formData.get("title") ?? ""),
      summary: optionalValue(formData.get("summary")),
      description: collectLinesByPrefix(formData, "overview_"),
      duration: String(formData.get("duration") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      minimum_age: String(formData.get("minimum_age") ?? ""),
      group_size: optionalValue(formData.get("group_size")),
      starting_price: String(formData.get("starting_price") ?? ""),
      location: String(formData.get("location") ?? "Uganda"),
      destination: String(formData.get("destination") ?? "Uganda"),
      hero_image_url: optionalValue(formData.get("hero_image_url")),
      hero_slides: collectTourHeroSlides(formData),
      highlights: parseLines(formData.get("highlights")),
      itinerary_days: collectTourItineraryDays(formData),
      included: parseLines(formData.get("included")),
      what_to_bring: parseLines(formData.get("what_to_bring")),
      booking_title: optionalValue(formData.get("booking_title")),
      booking_description: optionalValue(formData.get("booking_description")),
      related_tour_slugs: parseLines(formData.get("related_tour_slugs")),
      status: String(formData.get("status") ?? "draft"),
      meta_title: optionalValue(formData.get("meta_title")),
      meta_description: optionalValue(formData.get("meta_description")),
      meta_image_url: optionalValue(formData.get("meta_image_url")),
      published_at: optionalValue(formData.get("published_at")),
    };

    const { skippedColumns } = await upsertTourWithSchemaFallback(client, payload);

    revalidateSite();
    revalidatePath(`/tours/${slug}`);
    if (skippedColumns.length) {
      redirectWithTourMessage(
        "success",
        `Saved tour ${slug}, but your Supabase schema is missing: ${skippedColumns.join(", ")}. Run the latest tours migration to save those fields too.`,
        slug,
      );
    }
    redirectWithTourMessage("success", `Saved tour ${slug}.`, slug);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save tour.";
    redirectWithTourMessage("error", message, String(formData.get("slug") ?? ""));
  }
}

export async function upsertBlogPostAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const slug = String(formData.get("slug") ?? "");

    const { error } = await client.from("blog_posts").upsert(
      {
        slug,
        title: String(formData.get("title") ?? ""),
        excerpt: optionalValue(formData.get("excerpt")),
        category: optionalValue(formData.get("category")),
        featured_image_url: optionalValue(formData.get("featured_image_url")),
        status: String(formData.get("status") ?? "draft"),
        content: parseJsonField(formData.get("content"), "blog content"),
        meta_title: optionalValue(formData.get("meta_title")),
        meta_description: optionalValue(formData.get("meta_description")),
        meta_image_url: optionalValue(formData.get("meta_image_url")),
        published_at: optionalValue(formData.get("published_at")),
      },
      { onConflict: "slug" },
    );

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved blog post ${slug}.`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to save blog post.";
    redirectWithMessage("error", message);
  }
}

export async function updateSubmissionStatusAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const table = String(formData.get("table") ?? "");
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "new");

    if (table !== "contact_submissions" && table !== "quote_requests") {
      throw new Error("Unsupported submissions table.");
    }

    const { error } = await client.from(table).update({ status }).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/admin");
    redirectWithMessage("success", "Updated submission status.");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to update submission.";
    redirectWithMessage("error", message);
  }
}
