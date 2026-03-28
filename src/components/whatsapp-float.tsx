import Link from "next/link";

import { Icon } from "@/components/icons";

export function WhatsAppFloat({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <Link href={whatsappUrl} className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-105" aria-label="Chat on WhatsApp">
      <Icon name="whatsapp" className="h-7 w-7" />
    </Link>
  );
}
