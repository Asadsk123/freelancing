import { brand } from "@/config/brand";
import { MessageCircle } from "lucide-react";

export function WhatsAppCta() {
  const phone = brand.contact.phone.replace(/[\s+]/g, "");
  const message = encodeURIComponent("Hi! I'd like to discuss a project with ROYAL-ASAD.");
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 text-center">
        <MessageCircle className="mx-auto h-10 w-10 text-white mb-4" />
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Prefer to chat on WhatsApp?
        </h2>
        <p className="mt-3 text-green-100 text-lg max-w-xl mx-auto">
          Message us directly — we usually reply within a few hours.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-green-700 shadow-lg hover:bg-green-50 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
