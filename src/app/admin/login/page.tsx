import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getSiteSettings } from "@/lib/cms";
import { hasConfiguredAdminAccess, isAdminSessionValid } from "@/lib/admin-session";

import { loginAdminAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  const [params, settings, hasAccess] = await Promise.all([
    searchParams ? searchParams : Promise.resolve(undefined),
    getSiteSettings(),
    hasConfiguredAdminAccess(),
  ]);

  return (
    <main className="section-space">
      <div className="container-shell max-w-3xl">
        <div className="rounded-[2.25rem] border border-black/5 bg-white px-6 py-8 shadow-[0_24px_80px_rgba(17,24,39,0.12)] md:px-10 md:py-12">
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--sand)] shadow-sm">
              <Image src={settings.branding.logo} alt={settings.siteName} width={60} height={60} className="h-14 w-14 object-contain" />
            </div>
            <h1 className="mt-6 text-3xl font-black text-[var(--forest-deep)] md:text-4xl">Welcome to Smile Explorers Admin</h1>
            <p className="mt-3 text-sm leading-7 text-neutral-600">
              Sign in with your admin username and password to manage landing pages, tours, blog content, and submissions.
            </p>
          </div>

          {params?.error ? (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-700">
              {params.error}
            </div>
          ) : null}

          {!hasAccess ? (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-700">
              Admin access is not configured yet. Add an initial `CMS_ADMIN_PASSWORD` in your deployment environment, sign in once, then update the username and password inside the CMS.
            </div>
          ) : (
            <form action={loginAdminAction} className="mx-auto mt-8 grid max-w-xl gap-5 rounded-[2rem] border border-black/5 bg-[var(--sand)]/35 p-6 shadow-sm md:p-8">
              <label className="block text-sm font-semibold text-neutral-700" htmlFor="username">
                Username
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--forest)]"
                />
              </label>
              <label className="block text-sm font-semibold text-neutral-700" htmlFor="password">
                Password
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--forest)]"
                />
              </label>
              <div className="-mt-1 text-right">
                <Link href={`mailto:${settings.email}?subject=Smyle%20Explores%20Admin%20Access`} className="text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--orange)]">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-deep)]"
              >
                Log In
              </button>
              <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Access is restricted to authorized personnel only.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
