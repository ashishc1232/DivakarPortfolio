import { MessageCircle, Clapperboard, PhoneCall } from "lucide-react";
import { whatsapp } from "@/data/content";
import { useSwarmSection } from "@/swarm/provider";
import { useEnquiry } from "@/lib/enquiry";

export function Contact() {
  const ref = useSwarmSection<HTMLElement>("contact");
  const { plan, service, clear } = useEnquiry();
  const selection = plan ?? service;

  return (
    <section id="contact" ref={ref} className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
      <div
        data-sw="rect"
        data-sw-id="contact-frame"
        className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 sm:p-12 lg:p-16"
      >
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--accent-olive)" }}
          aria-hidden="true"
        />
        <p
          data-sw="text"
          data-sw-id="contact-label"
          className="font-mono text-[11px] uppercase tracking-[0.25em]"
          style={{ color: "var(--accent-olive)" }}
        >
          12 / CONTACT
        </p>
        <h2
          data-sw="text"
          data-sw-id="contact-title"
          className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Ready to create something{" "}
          <span className="font-serif italic font-normal" style={{ color: "var(--accent-olive)" }}>
            unforgettable?
          </span>
        </h2>
        <p
          data-sw="text"
          data-sw-id="contact-sub"
          className="mt-4 text-base text-muted-foreground sm:text-lg"
        >
          Get started with a free discovery call.
        </p>

        {selection ? (
          <div
            data-sw="text"
            data-sw-id="contact-selection"
            className="mt-6 flex w-fit items-center gap-3 rounded-full border border-border bg-elevated px-4 py-2 text-sm text-foreground"
          >
            <span>
              Enquiry: <strong className="font-semibold">{selection}</strong>
            </span>
            <button
              type="button"
              onClick={clear}
              className="font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              clear
            </button>
          </div>
        ) : null}

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
            data-sw="rect"
            data-sw-id="contact-cta1"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--accent-olive)", color: "#10130d" }}
          >
            <MessageCircle className="h-4 w-4" /> Start a Project
          </a>
          <a
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
            data-sw="rect"
            data-sw-id="contact-cta2"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <PhoneCall className="h-4 w-4" /> Free Discovery Call Enquiry
          </a>
          <a
            href="#pricing"
            data-sw="text"
            data-sw-id="contact-cta3"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <Clapperboard className="h-4 w-4" /> View Pricing
          </a>
        </div>
        <p
          data-sw="text"
          data-sw-id="contact-note"
          className="mt-6 max-w-xl text-xs leading-relaxed text-muted-foreground"
        >
          Message Divakar on WhatsApp at +91 91362 28403 with your footage, brief and deadline.
        </p>
      </div>
    </section>
  );
}
