import { redirect } from "next/navigation";

import { hasCmsAdminPassword, isAdminSessionValid } from "@/lib/admin-session";

import { loginAdminAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminSessionValid()) {
    redirect("/admin");
  }

  return (
    <main className="section-space">
      <div className="container-shell max-w-xl">
        <div className="rounded-[2rem] border border-black/5 bg-white p-10 shadow-soft">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--orange)]">CMS Access</div>
          <h1 className="mt-4 text-4xl font-black text-[var(--forest-deep)]">Sign in to the Smyle Explores CMS</h1>
          <p className="mt-4 text-sm leading-7 text-neutral-600">
            This admin surface is protected by `CMS_ADMIN_PASSWORD` and uses the Supabase service role key for writes.
          </p>
          {!hasCmsAdminPassword() ? (
            <div className="mt-8 rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-700">
              `CMS_ADMIN_PASSWORD` is not configured. Add it to your environment before using the CMS.
            </div>
          ) : (
            <form action={loginAdminAction} className="mt-8 space-y-4">
              <label className="block text-sm font-semibold text-neutral-700" htmlFor="password">
                Admin password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]"
              />
              <button type="submit" className="rounded-full bg-[var(--orange)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest)]">
                Enter CMS
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
