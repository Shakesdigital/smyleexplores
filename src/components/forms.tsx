"use client";

import { FormEvent, useState } from "react";

type FormState = {
  pending: boolean;
  success: string;
  error: string;
};

export function ContactForm({ whatsappUrl }: { whatsappUrl: string }) {
  const [state, setState] = useState<FormState>({ pending: false, success: "", error: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      setState({ pending: true, success: "", error: "" });
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Submission failed.");
      }

      setState({
        pending: false,
        success: result.message ?? "Inquiry saved successfully.",
        error: "",
      });
      form.reset();
    } catch (error) {
      setState({ pending: false, success: "", error: error instanceof Error ? error.message : "Submission failed." });
    }
  }

  return (
    <form className="space-y-4 rounded-[2rem] bg-white p-8 shadow-soft" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="name" placeholder="Name" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
        <input required type="email" name="email" placeholder="Email" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="phone" placeholder="Phone Number" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
        <input required name="subject" placeholder="Subject" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      </div>
      <textarea required name="message" placeholder="Message" rows={5} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={state.pending} className="rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white transition hover:bg-[var(--forest)] disabled:opacity-70">
          {state.pending ? "Sending..." : "Submit"}
        </button>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[var(--forest)] px-6 py-4 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white">
          Message on WhatsApp
        </a>
      </div>
      {state.success ? <p className="text-sm font-semibold text-[var(--forest)]">{state.success}</p> : null}
      {state.error ? <p className="text-sm font-semibold text-red-600">{state.error}</p> : null}
    </form>
  );
}

export function QuoteForm({
  whatsappUrl,
  preferredTour,
}: {
  whatsappUrl: string;
  preferredTour?: string;
}) {
  const [state, setState] = useState<FormState>({ pending: false, success: "", error: "" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    try {
      setState({ pending: true, success: "", error: "" });
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Submission failed.");
      }

      setState({
        pending: false,
        success: result.message ?? "Quote request saved successfully.",
        error: "",
      });
      form.reset();
    } catch (error) {
      setState({ pending: false, success: "", error: error instanceof Error ? error.message : "Submission failed." });
    }
  }

  return (
    <form className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="name" placeholder="Name" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
        <input required type="email" name="email" placeholder="Email" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="phone" placeholder="Phone" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
        <input required type="date" name="travelDate" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input required name="guests" placeholder="Number of Guests" className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
        <input name="tour" placeholder="Preferred Tour" defaultValue={preferredTour ?? ""} className="rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      </div>
      <textarea name="specialRequests" placeholder="Special Requests" rows={5} className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-[var(--forest)]" />
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={state.pending} className="rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white transition hover:bg-[var(--forest)] disabled:opacity-70">
          {state.pending ? "Sending..." : "Submit"}
        </button>
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[var(--forest)] px-6 py-4 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white">
          Prefer WhatsApp
        </a>
      </div>
      <p className="text-sm text-neutral-500">Your request is stored in the CMS and can also be followed up on WhatsApp.</p>
      {state.success ? <p className="text-sm font-semibold text-[var(--forest)]">{state.success}</p> : null}
      {state.error ? <p className="text-sm font-semibold text-red-600">{state.error}</p> : null}
    </form>
  );
}
