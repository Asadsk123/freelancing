import { brand } from "@/config/brand";
import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const phone = brand.contact.phone.replace(/[\s+]/g, "");
  const msg = encodeURIComponent("Hi! I'd like to discuss a project with ROYAL-ASAD.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/40 hover:bg-green-600 transition-colors"
    >
      <MessageCircle className="h-7 w-7 text-white fill-white" />
    </a>
  );
}
