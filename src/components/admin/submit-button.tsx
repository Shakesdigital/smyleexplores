"use client";

import { useFormStatus } from "react-dom";

export function AdminSubmitButton({
  children,
  className,
  pendingLabel = "Saving...",
}: {
  children: string;
  className: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      <span className="inline-flex items-center gap-2">
        {pending ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
          />
        ) : null}
        <span>{pending ? pendingLabel : children}</span>
      </span>
    </button>
  );
}
