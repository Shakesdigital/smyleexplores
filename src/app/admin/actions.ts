"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import {
  clearAdminSession,
  createAdminSession,
  createAdminSessionSecret,
  createPasswordHash,
  getConfiguredAdminAccess,
  isAdminSessionValid,
  verifyAdminCredentials,
} from "@/lib/admin-session";
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

function normalizeSlug(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function sanitizeHtmlInput(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .trim();
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

function setStringFieldIfPresent(target: Record<string, unknown>, formData: FormData, inputName: string, outputKey = inputName) {
  if (!formData.has(inputName)) return;
  target[outputKey] = String(formData.get(inputName) ?? "");
}

function setLinesFieldIfPresent(target: Record<string, unknown>, formData: FormData, prefix: string, outputKey: string) {
  const hasMatchingField = Array.from(formData.keys()).some((key) => key.startsWith(prefix));
  if (!hasMatchingField) return;
  target[outputKey] = collectLinesByPrefix(formData, prefix);
}

function setHeroSlidesIfPresent(target: Record<string, unknown>, formData: FormData, fieldPrefix: string, outputKey: string) {
  const hasHeroSlideField = Array.from(formData.keys()).some((key) => key.startsWith(fieldPrefix));
  if (!hasHeroSlideField) return;
  target[outputKey] = collectPageHeroSlides(formData);
}

function buildPageContent(formData: FormData, slug: string) {
  if (formData.has("content")) {
    return parseJsonField(formData.get("content"), "page content");
  }

  switch (slug) {
    case "home": {
      const content: Record<string, unknown> = {};
      setStringFieldIfPresent(content, formData, "heroImage");
      setStringFieldIfPresent(content, formData, "heroTitle");
      setStringFieldIfPresent(content, formData, "heroSubtitle");
      setStringFieldIfPresent(content, formData, "heroCtaLabel");
      setStringFieldIfPresent(content, formData, "heroCtaHref");
      setHeroSlidesIfPresent(content, formData, "heroSlide", "heroSlides");
      setStringFieldIfPresent(content, formData, "introEyebrow");
      setStringFieldIfPresent(content, formData, "introTitle");
      setStringFieldIfPresent(content, formData, "introDescription");
      setLinesFieldIfPresent(content, formData, "introParagraph_", "introParagraphs");
      setStringFieldIfPresent(content, formData, "featureImage");
      setStringFieldIfPresent(content, formData, "whyEyebrow");
      setStringFieldIfPresent(content, formData, "whyTitle");
      setStringFieldIfPresent(content, formData, "whyDescription");
      if ([1, 2, 3].some((index) => formData.has(`whyItemTitle_${index}`) || formData.has(`whyItemDescription_${index}`) || formData.has(`whyItemIcon_${index}`))) {
        content.whyChooseUsItems = [1, 2, 3]
          .map((index) => ({
            title: String(formData.get(`whyItemTitle_${index}`) ?? "").trim(),
            description: String(formData.get(`whyItemDescription_${index}`) ?? "").trim(),
            icon: String(formData.get(`whyItemIcon_${index}`) ?? "").trim(),
          }))
          .filter((item) => item.title && item.description);
      }
      setStringFieldIfPresent(content, formData, "toursEyebrow");
      setStringFieldIfPresent(content, formData, "toursTitle");
      setStringFieldIfPresent(content, formData, "toursDescription");
      setStringFieldIfPresent(content, formData, "toursCtaLabel");
      setStringFieldIfPresent(content, formData, "toursCtaHref");
      setStringFieldIfPresent(content, formData, "quoteImage");
      setStringFieldIfPresent(content, formData, "quoteText");
      setStringFieldIfPresent(content, formData, "testimonialsEyebrow");
      setStringFieldIfPresent(content, formData, "testimonialsTitle");
      setStringFieldIfPresent(content, formData, "testimonialsDescription");
      setStringFieldIfPresent(content, formData, "ctaEyebrow");
      setStringFieldIfPresent(content, formData, "ctaTitle");
      setStringFieldIfPresent(content, formData, "ctaDescription");
      setStringFieldIfPresent(content, formData, "ctaButtonLabel");
      setStringFieldIfPresent(content, formData, "ctaButtonHref");
      return content;
    }
    case "about": {
      const content: Record<string, unknown> = {};
      setStringFieldIfPresent(content, formData, "heroImage");
      setStringFieldIfPresent(content, formData, "heroTitle");
      setStringFieldIfPresent(content, formData, "heroSubtitle");
      setHeroSlidesIfPresent(content, formData, "heroSlide", "heroSlides");
      setStringFieldIfPresent(content, formData, "storyEyebrow");
      setStringFieldIfPresent(content, formData, "storyTitle");
      setStringFieldIfPresent(content, formData, "storyImage");
      setLinesFieldIfPresent(content, formData, "storyParagraph_", "storyParagraphs");
      setStringFieldIfPresent(content, formData, "missionEyebrow");
      setStringFieldIfPresent(content, formData, "missionQuote");
      setStringFieldIfPresent(content, formData, "valuesEyebrow");
      setStringFieldIfPresent(content, formData, "valuesTitle");
      setStringFieldIfPresent(content, formData, "ctaTitle");
      setStringFieldIfPresent(content, formData, "ctaButtonLabel");
      setStringFieldIfPresent(content, formData, "ctaButtonHref");
      return content;
    }
    case "tours": {
      const content: Record<string, unknown> = {};
      setStringFieldIfPresent(content, formData, "heroImage");
      setStringFieldIfPresent(content, formData, "heroTitle");
      setStringFieldIfPresent(content, formData, "heroSubtitle");
      setHeroSlidesIfPresent(content, formData, "heroSlide", "heroSlides");
      setStringFieldIfPresent(content, formData, "introEyebrow");
      setStringFieldIfPresent(content, formData, "introTitle");
      setStringFieldIfPresent(content, formData, "introDescription");
      return content;
    }
    case "blog": {
      const content: Record<string, unknown> = {};
      setStringFieldIfPresent(content, formData, "heroImage");
      setStringFieldIfPresent(content, formData, "heroTitle");
      setStringFieldIfPresent(content, formData, "heroSubtitle");
      setHeroSlidesIfPresent(content, formData, "heroSlide", "heroSlides");
      setStringFieldIfPresent(content, formData, "introEyebrow");
      setStringFieldIfPresent(content, formData, "introTitle");
      setStringFieldIfPresent(content, formData, "introDescription");
      return content;
    }
    case "contact": {
      const content: Record<string, unknown> = {};
      setStringFieldIfPresent(content, formData, "heroImage");
      setStringFieldIfPresent(content, formData, "heroTitle");
      setStringFieldIfPresent(content, formData, "heroSubtitle");
      setHeroSlidesIfPresent(content, formData, "heroSlide", "heroSlides");
      setStringFieldIfPresent(content, formData, "introEyebrow");
      setStringFieldIfPresent(content, formData, "introTitle");
      setStringFieldIfPresent(content, formData, "quoteEyebrow");
      setStringFieldIfPresent(content, formData, "quoteTitle");
      setStringFieldIfPresent(content, formData, "browseCtaLabel");
      setStringFieldIfPresent(content, formData, "browseCtaHref");
      return content;
    }
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
  "cta_label",
  "cta_href",
  "related_tour_slugs",
]);

function extractMissingColumn(errorMessage: string) {
  const match = errorMessage.match(/Could not find the '([^']+)' column/i);
  return match?.[1] ?? null;
}

function buildLegacyTourCompatPayload(workingPayload: Record<string, unknown>) {
  const currentDescription = Array.isArray(workingPayload.description)
    ? workingPayload.description
    : typeof workingPayload.description === "object" && workingPayload.description && Array.isArray((workingPayload.description as Record<string, unknown>).overview)
      ? ((workingPayload.description as Record<string, unknown>).overview as unknown[])
      : [];

  return {
    overview: currentDescription,
    cmsCompat: {
      destination: typeof workingPayload.destination === "string" ? workingPayload.destination : "",
      heroSlides: Array.isArray(workingPayload.hero_slides) ? workingPayload.hero_slides : [],
      itineraryDays: Array.isArray(workingPayload.itinerary_days) ? workingPayload.itinerary_days : [],
      bookingTitle: typeof workingPayload.booking_title === "string" ? workingPayload.booking_title : "",
      bookingDescription: typeof workingPayload.booking_description === "string" ? workingPayload.booking_description : "",
      relatedTourSlugs: Array.isArray(workingPayload.related_tour_slugs) ? workingPayload.related_tour_slugs : [],
      cardCta: {
        label: typeof workingPayload.cta_label === "string" ? workingPayload.cta_label : "",
        href: typeof workingPayload.cta_href === "string" ? workingPayload.cta_href : "",
      },
    },
  };
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

    if ("description" in workingPayload) {
      workingPayload.description = buildLegacyTourCompatPayload(workingPayload);
    }

    delete workingPayload[missingColumn];
    skippedColumns.push(missingColumn);
  }
}

export async function loginAdminAction(formData: FormData) {
  try {
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");
    const config = await verifyAdminCredentials(username, password);

    await createAdminSession(config.sessionSecret);
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

export async function updateAdminCredentialsAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const currentPassword = String(formData.get("current_password") ?? "");
    const nextUsername = String(formData.get("username") ?? "").trim();
    const nextPassword = String(formData.get("new_password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");
    const currentConfig = await getConfiguredAdminAccess();

    if (!currentConfig) {
      throw new Error("Admin access is not configured yet.");
    }

    if (nextUsername.length < 3) {
      throw new Error("Username must be at least 3 characters.");
    }

    if (nextPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    if (nextPassword !== confirmPassword) {
      throw new Error("New password and confirmation do not match.");
    }

    await verifyAdminCredentials(currentConfig.username, currentPassword);

    const passwordHash = createPasswordHash(nextPassword);
    const existing = await client.from("admin_accounts").select("id").order("updated_at", { ascending: false }).limit(1).maybeSingle();

    if (existing.data?.id) {
      const { error } = await client
        .from("admin_accounts")
        .update({ username: nextUsername, password_hash: passwordHash, updated_at: new Date().toISOString() })
        .eq("id", existing.data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.from("admin_accounts").insert({ username: nextUsername, password_hash: passwordHash });
      if (error) throw new Error(error.message);
    }

    await createAdminSession(createAdminSessionSecret(nextUsername, passwordHash));
    revalidatePath("/admin");
    redirectWithMessage("success", "Updated admin login credentials.");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to update admin credentials.";
    redirectWithMessage("error", message);
  }
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
    const updates = buildPageContent(formData, slug);
    const existingPage = await client.from("pages").select("content").eq("slug", slug).maybeSingle();
    const mergedContent = {
      ...((existingPage.data?.content as Record<string, unknown> | null) ?? {}),
      ...updates,
    };

    const { error } = await client.from("pages").upsert(
      {
        slug,
        title: String(formData.get("title") ?? ""),
        excerpt: optionalValue(formData.get("excerpt")),
        status: String(formData.get("status") ?? "draft"),
        content: mergedContent,
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
      photo_url: optionalValue(formData.get("photo_url")),
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

export async function deleteTestimonialAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const id = String(formData.get("id") ?? "");
    if (!id) throw new Error("Missing testimonial id.");

    const { error } = await client.from("testimonials").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/");
    revalidatePath("/admin");
    redirectWithMessage("success", "Deleted testimonial.");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to delete testimonial.";
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

    const slug = normalizeSlug(formData.get("slug"));
    if (!slug) {
      throw new Error("A valid slug is required.");
    }

    const status = String(formData.get("status") ?? "published");
    const publishedAtInput = optionalValue(formData.get("published_at"));
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
      cta_label: optionalValue(formData.get("cta_label")),
      cta_href: optionalValue(formData.get("cta_href")),
      related_tour_slugs: parseLines(formData.get("related_tour_slugs")),
      status,
      meta_title: optionalValue(formData.get("meta_title")),
      meta_description: optionalValue(formData.get("meta_description")),
      meta_image_url: optionalValue(formData.get("meta_image_url")),
      published_at: status === "published" ? publishedAtInput ?? new Date().toISOString() : publishedAtInput,
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
    const existingPost = await client
      .from("blog_posts")
      .select("excerpt,category,featured_image_url,content,meta_title,meta_description,meta_image_url,published_at")
      .eq("slug", slug)
      .maybeSingle();

    const existingData = existingPost.data ?? null;
    const nextHtml = formData.has("content_html") ? sanitizeHtmlInput(formData.get("content_html")) : null;
    const nextContent = formData.has("content")
      ? parseJsonField(formData.get("content"), "blog content")
      : {
          ...((existingData?.content as Record<string, unknown> | null) ?? {}),
          ...(nextHtml !== null ? { html: nextHtml } : {}),
        };

    const { error } = await client.from("blog_posts").upsert(
      {
        slug,
        title: String(formData.get("title") ?? ""),
        excerpt: formData.has("excerpt") ? optionalValue(formData.get("excerpt")) : existingData?.excerpt ?? null,
        category: formData.has("category") ? optionalValue(formData.get("category")) : existingData?.category ?? null,
        featured_image_url: formData.has("featured_image_url")
          ? optionalValue(formData.get("featured_image_url"))
          : existingData?.featured_image_url ?? null,
        status: String(formData.get("status") ?? "draft"),
        content: nextContent,
        meta_title: formData.has("meta_title") ? optionalValue(formData.get("meta_title")) : existingData?.meta_title ?? null,
        meta_description: formData.has("meta_description")
          ? optionalValue(formData.get("meta_description"))
          : existingData?.meta_description ?? null,
        meta_image_url: formData.has("meta_image_url")
          ? optionalValue(formData.get("meta_image_url"))
          : existingData?.meta_image_url ?? null,
        published_at: formData.has("published_at") ? optionalValue(formData.get("published_at")) : existingData?.published_at ?? null,
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

export async function deleteBlogPostAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const id = String(formData.get("id") ?? "");
    const slug = String(formData.get("slug") ?? "");
    if (!id) throw new Error("Missing blog post id.");

    const { error } = await client.from("blog_posts").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidateSite();
    redirect(`/admin?tab=blog&success=${encodeMessage(`Deleted blog post ${slug || "entry"}.`)}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    const message = error instanceof Error ? error.message : "Failed to delete blog post.";
    redirect(`/admin?tab=blog&error=${encodeMessage(message)}`);
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
