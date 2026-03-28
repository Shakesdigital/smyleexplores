"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function parseJsonField(value: FormDataEntryValue | null, fieldName: string) {
  try {
    return JSON.parse(String(value ?? "{}"));
  } catch {
    throw new Error(`Invalid JSON in ${fieldName}.`);
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

    const { error } = await client.from("settings").upsert({
      group_key: groupKey,
      key,
      value,
      is_public: isPublic,
    }, { onConflict: "key" });

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved setting ${key}.`);
  } catch (error) {
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

    const { error } = await client.from("pages").upsert({
      slug,
      title: String(formData.get("title") ?? ""),
      excerpt: optionalValue(formData.get("excerpt")),
      status: String(formData.get("status") ?? "draft"),
      content: parseJsonField(formData.get("content"), "page content"),
      featured_image_url: optionalValue(formData.get("featured_image_url")),
      meta_title: optionalValue(formData.get("meta_title")),
      meta_description: optionalValue(formData.get("meta_description")),
      meta_image_url: optionalValue(formData.get("meta_image_url")),
      published_at: optionalValue(formData.get("published_at")),
    }, { onConflict: "slug" });

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved page ${slug}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save page.";
    redirectWithMessage("error", message);
  }
}

export async function upsertTourAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const slug = String(formData.get("slug") ?? "");

    const { error } = await client.from("tours").upsert({
      slug,
      title: String(formData.get("title") ?? ""),
      summary: optionalValue(formData.get("summary")),
      description: parseLines(formData.get("description")),
      duration: String(formData.get("duration") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      minimum_age: String(formData.get("minimum_age") ?? ""),
      group_size: optionalValue(formData.get("group_size")),
      starting_price: String(formData.get("starting_price") ?? ""),
      location: String(formData.get("location") ?? "Jinja, Uganda"),
      hero_image_url: optionalValue(formData.get("hero_image_url")),
      highlights: parseLines(formData.get("highlights")),
      included: parseLines(formData.get("included")),
      what_to_bring: parseLines(formData.get("what_to_bring")),
      status: String(formData.get("status") ?? "draft"),
      meta_title: optionalValue(formData.get("meta_title")),
      meta_description: optionalValue(formData.get("meta_description")),
      meta_image_url: optionalValue(formData.get("meta_image_url")),
      published_at: optionalValue(formData.get("published_at")),
    }, { onConflict: "slug" });

    if (error) throw new Error(error.message);

    revalidateSite();
    revalidatePath(`/tours/${slug}`);
    redirectWithMessage("success", `Saved tour ${slug}.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save tour.";
    redirectWithMessage("error", message);
  }
}

export async function upsertBlogPostAction(formData: FormData) {
  try {
    await requireAdminSession();
    const client = createSupabaseServiceRoleClient();
    if (!client) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

    const slug = String(formData.get("slug") ?? "");

    const { error } = await client.from("blog_posts").upsert({
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
    }, { onConflict: "slug" });

    if (error) throw new Error(error.message);

    revalidateSite();
    redirectWithMessage("success", `Saved blog post ${slug}.`);
  } catch (error) {
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
    const message = error instanceof Error ? error.message : "Failed to update submission.";
    redirectWithMessage("error", message);
  }
}
