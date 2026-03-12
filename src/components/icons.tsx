type IconProps = {
  className?: string;
};

export function LogoMark({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 36c8-20 30-28 42-22-10 4-17 13-19 22 7-3 12-2 17 2-11 3-24 7-40 12 2-5 2-9 0-14Z" fill="#2E7D32" />
      <circle cx="22" cy="20" r="4" fill="#F57C00" />
    </svg>
  );
}

export function Icon({ name, className = "h-6 w-6" }: IconProps & { name: string }) {
  const common = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };

  switch (name) {
    case "shield":
      return <svg {...common}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9.5 12 1.8 1.8L15 10.2" /></svg>;
    case "map":
      return <svg {...common}><path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2V6Z" /><path d="M9 4v14" /><path d="M15 6v14" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /></svg>;
    case "leaf":
      return <svg {...common}><path d="M19 5c-8 0-13 5-13 11 0 2.2 1.8 4 4 4 6 0 11-5 11-13V5h-2Z" /><path d="M7 17c2-3 5-5 10-7" /></svg>;
    case "mountain":
      return <svg {...common}><path d="m3 19 7-11 4 6 3-4 4 9H3Z" /></svg>;
    case "people":
      return <svg {...common}><circle cx="9" cy="9" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M4 19c0-2.8 2.7-5 6-5s6 2.2 6 5" /><path d="M15.5 19c0-2 1.8-3.6 4-3.9" /></svg>;
    case "instagram":
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>;
    case "facebook":
      return <svg {...common}><path d="M14 8h2V4h-2c-2.2 0-4 1.8-4 4v3H8v4h2v5h4v-5h2.5l.5-4H14V8Z" /></svg>;
    case "whatsapp":
      return <svg {...common}><path d="M20 12a8 8 0 0 1-11.7 7l-4.3 1 1-4.1A8 8 0 1 1 20 12Z" /><path d="M9 9.5c.4 2 2.2 4.3 4.6 5.2l1.3-1.2c.3-.2.6-.3.9-.1l2 .9c.4.2.5.7.2 1a4.1 4.1 0 0 1-4.1 1.1c-3-.8-5.9-3.8-6.8-6.8A4.1 4.1 0 0 1 8.2 5.5c.3-.3.8-.2 1 .2l.9 2c.2.3.1.7-.1.9L9 9.5Z" /></svg>;
    default:
      return null;
  }
}
