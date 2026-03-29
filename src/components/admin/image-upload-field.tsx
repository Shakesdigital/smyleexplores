"use client";

import { ChangeEvent, useMemo, useState } from "react";

type UploadResponse = {
  path: string;
  url: string;
};

function inferStoragePath(url: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const marker = "/storage/v1/object/public/cms-media/";
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return "";
    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return "";
  }
}

export function ImageUploadField({
  label,
  name,
  defaultValue = "",
  folder = "general",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  folder?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [storagePath, setStoragePath] = useState(() => inferStoragePath(defaultValue));
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");

  const previewSrc = useMemo(() => value.trim(), [value]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsBusy(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as UploadResponse | { error?: string };
      if (!response.ok || !("url" in payload) || !payload.url) {
        throw new Error("error" in payload && payload.error ? payload.error : "Upload failed.");
      }

      setValue(payload.url);
      setStoragePath(payload.path);
      event.target.value = "";
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemove() {
    setError("");

    if (storagePath) {
      setIsBusy(true);

      try {
        const response = await fetch("/api/admin/delete-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: storagePath }),
        });

        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Delete failed.");
        }
      } catch (deleteError) {
        setError(deleteError instanceof Error ? deleteError.message : "Delete failed.");
        setIsBusy(false);
        return;
      }
    }

    setValue("");
    setStoragePath("");
    setIsBusy(false);
  }

  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <input
        name={name}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setStoragePath(inferStoragePath(event.target.value));
        }}
        className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white">
          {isBusy ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isBusy} />
        </label>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isBusy || !value}
          className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-600 transition hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Remove Image
        </button>
      </div>
      {previewSrc ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-[var(--sand)]/35">
          <img src={previewSrc} alt={label} className="h-40 w-full object-cover" />
        </div>
      ) : null}
      {error ? <p className="mt-3 text-xs font-medium text-red-600">{error}</p> : null}
      <p className="mt-3 text-xs leading-6 text-neutral-500">Upload from your device or paste an existing image URL. Save the form after changing this field.</p>
    </label>
  );
}
