import { WHATSAPP_HREF } from "@/data/contact";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Customer Service"
      className="fixed bottom-[100px] left-4 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 sm:bottom-8 sm:left-8 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
